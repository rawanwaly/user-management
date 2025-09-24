import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GridConfig } from 'src/app/components/models/grid.models';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Router } from '@angular/router';
import { USER_GRID_CONFIG } from 'src/app/components/configs/user-grid.config';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable } from 'rxjs';
import { FileService } from '../file.service';
import { ConfirmationService } from 'src/app/components/shared/confirmation-model/service/confirmation.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  @ViewChild('statusTemplate', { static: true })
  statusTemplate!: TemplateRef<any>;
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
    columns: [
      ...USER_GRID_CONFIG.columns.map((col) => {
        if (col.field === 'isActive') {
          return {
            ...col,
            template: this.statusTemplate,
          };
        }
        return col;
      }),
    ],
    fetchPagedData: (req) => this.userService.getPagedUsers(req),
    fetchAllData: () => this.userService.getAll(),
    fetchAllIds: (search) => this.userService.getAllIds(search),

    onBulkActivate: (ids) =>
      this.confirmAndRun(
        this.translate.instant('User.ConfirmActivateUsers', { count: ids.length }),
        () => this.userService.activateSelected(ids)
      ),

    onBulkDeactivate: (ids) =>
      this.confirmAndRun(
        this.translate.instant('User.ConfirmDeactivateUsers', { count: ids.length }),
        () => this.userService.deactivateSelected(ids)
      ),

    onBulkExport: (ids) => {
      firstValueFrom(this.userService.exportSelected(ids)).then((file) => {
        this.fileService.download(
          file,
          `Users_Selected_${new Date().toISOString()}.xlsx`
        );
      });
    },

    actions: [
      {
        label: (row: User) =>
          row.isActive ? 'Actions.Deactivate' : 'Actions.Activate',
        type: (row: User) => (row.isActive ? 'danger' : 'success'),
        onClick: (row: User) => {
          if (row.isActive) {
            this.deactivateUser(row.id);
          } else {
            this.activateUser(row.id);
          }
        },
      },
      {
        label: 'Actions.Edit',
        type: 'primary',
        onClick: (row: User) => this.editUser(row.id),
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
  activateUser(userId: number): void {
    this.confirmService.openConfirmDialog(
      this.translate.instant('User.ConfirmActivateUser'),
      '',
      () => {
        firstValueFrom(this.userService.activateUser(userId)).then(() =>
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

private confirmAndRun(message: string, action: () => Observable<any>): void {
  this.confirmService.openConfirmDialog(message, '', () => {
    firstValueFrom(action()).then(() => this.refreshGrid());
  });
}

}
