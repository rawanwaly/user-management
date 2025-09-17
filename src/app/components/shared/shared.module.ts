import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';

import { ConfirmationModalComponent } from './confirmation-model/confirmation-modal.component';
import { CustomGridComponent } from '../custom-grid/custom-grid.component'; // 👈 import your grid

@NgModule({
  declarations: [
    ConfirmationModalComponent,
    CustomGridComponent,   // 👈 declare it here
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
  ],
  exports: [
    ConfirmationModalComponent,
    CustomGridComponent,   
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
  ]
})
export class SharedModule {}
