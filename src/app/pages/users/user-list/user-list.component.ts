import { Component, OnInit } from '@angular/core';
import { GridConfig } from 'src/app/components/models/grid.models';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { USER_GRID_CONFIG } from 'src/app/components/configs/user-grid.config';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { FileService } from '../file.service';
import { ConfirmationService } from 'src/app/components/shared/confirmation-model/service/confirmation.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users$ = this.userService.getAll();
  userGridConfig!: GridConfig<User>;

  constructor(
    private userService: UserService,
    private router: Router,
    private translate: TranslateService,
    public confirmService: ConfirmationService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.userGridConfig = this.buildGridConfig();
  }

  private buildGridConfig(): GridConfig<User> {
    return {
      ...USER_GRID_CONFIG,

      fetchPagedData: (req) => this.userService.getPagedUsers(req),
      fetchAllData: () => this.userService.getAll(),
      fetchAllIds: (search) => this.userService.getAllIds(search),
      rowClass: (user: User) => (!user.isActive ? 'inactive-row' : ''),

      onBulkActivate: (ids) =>
        this.confirmService.openConfirmDialog(
          this.translate.instant('User.ConfirmActivateUsers', { count: ids.length }),
          '',
          () => {
            firstValueFrom(this.userService.activateSelected(ids)).then(() =>
              this.refreshGrid()
            );
          }
        ),

      onBulkDeactivate: (ids) =>
        this.confirmService.openConfirmDialog(
          this.translate.instant('User.ConfirmDeactivateUsers', { count: ids.length }),
          '',
          () => {
            firstValueFrom(this.userService.deactivateSelected(ids)).then(() =>
              this.refreshGrid()
            );
          }
        ),

      onBulkExport: (ids) => {
        firstValueFrom(this.userService.exportSelected(ids)).then((file) => {
          this.fileService.download(file, `Users_Selected_${new Date().toISOString()}.xlsx`);
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

  deactivateUser(userId: number): void {
    this.confirmService.openConfirmDialog(
      this.translate.instant('User.ConfirmDeactivateUser'),
      '',
      () => {
        firstValueFrom(this.userService.deactivateUser(userId)).then(() =>
          this.refreshGrid()
        );
      }
    );
  }

  editUser(userId: number): void {
    this.router.navigate(['/user/edit', userId]);
  }

  addNewUser(): void {
    this.router.navigate(['/user/add']);
  }

  private refreshGrid(): void {
    this.userGridConfig = {
      ...this.userGridConfig,
      reloadFlag: Date.now(),
    };
  }
}
