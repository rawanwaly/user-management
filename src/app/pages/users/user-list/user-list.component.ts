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
  userGridConfig = USER_GRID_CONFIG;   


  constructor(private userService: UserService,    private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(res => {
      this.users = res;
    });
  }
editUser(userId: number): void {
    this.router.navigate(['/user/edit', userId]);
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.delete(userId);
    }
  }

  addNewUser(): void {
    this.router.navigate(['/user/add']);
  }
  
}
