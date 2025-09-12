// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalComponent } from './confirmation-model/confirmation-modal.component';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [
    CommonModule,
    TranslateModule  
  ],
  exports: [ConfirmationModalComponent]  
})
export class SharedModule {}
