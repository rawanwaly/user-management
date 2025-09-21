import { Component, OnInit } from '@angular/core';
import { GridConfig } from 'src/app/components/models/grid.models';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { USER_GRID_CONFIG } from 'src/app/components/configs/user-grid.config';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  searchTerm = '';
  userGridConfig!: GridConfig<User>;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();

    this.userGridConfig = {
      ...USER_GRID_CONFIG,

      fetchPagedData: (req) => this.userService.getPagedUsers(req),
      fetchAllData: () => this.userService.getAll(),
      fetchAllIds: (search) => this.userService.getAllIds(search),
      rowClass: (user: User) => (!user.isActive ? 'inactive-row' : ''),
      onBulkActivate: (ids: number[]) => {
        this.userService.activateSelected(ids).subscribe(() => {
          this.userGridConfig = {
            ...this.userGridConfig,
            reloadFlag: new Date().getTime(),
          };
        });
      },
      onBulkDeactivate: (ids: number[]) => {
        if (
          confirm(`Are you sure you want to deactivate ${ids.length} user(s)?`)
        ) {
          this.userService.deactivateSelected(ids).subscribe(() => {
            this.userGridConfig = {
              ...this.userGridConfig,
              reloadFlag: new Date().getTime(),
            };
          });
        }
      },
      onBulkExport: (ids: number[]) => {
        this.userService.exportSelected(ids).subscribe((file) => {
          const url = window.URL.createObjectURL(file);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Users_Selected_${new Date().toISOString()}.xlsx`;
          a.click();
          window.URL.revokeObjectURL(url);
        });
      },

      actions: [
        {
          label: 'Actions.Edit',
          type: 'primary',
          onClick: (row: User) => this.editUser(row.id),
        },
        {
          label: 'Actions.Delete',
          type: 'danger',
          onClick: (row: User) => this.deactivateUser(row.id),
        },
      ],
    };
  }

  loadUsers() {
    this.userService.getAll().subscribe((res) => {
      this.users = res;
    });
  }

  editUser(userId: number): void {
    this.router.navigate(['/user/edit', userId]);
  }

  deactivateUser(userId: number): void {
    if (confirm('Are you sure you want to deactivate this user?')) {
      this.userService.deactivateUser(userId).subscribe(() => {
        this.userGridConfig = {
          ...this.userGridConfig,
          reloadFlag: new Date().getTime(),
        };
      });
    }
  }

  addNewUser(): void {
    this.router.navigate(['/user/add']);
  }
}
