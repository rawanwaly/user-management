// user-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {  UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  private subscription: Subscription = new Subscription();

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.userService.getAll().subscribe(users => {
        this.users = users;
        this.filteredUsers = users;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  searchUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = this.users;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.firstNameAR.toLowerCase().includes(term) ||
      user.lastNameAR.toLowerCase().includes(term) ||
      user.firstNameEN.toLowerCase().includes(term) ||
      user.lastNameEN.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.mobileNumber.includes(term)
    );
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