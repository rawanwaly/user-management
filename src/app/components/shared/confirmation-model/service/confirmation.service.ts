import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  modalVisible = false;
  modalTitle = '';
  modalMessage = '';
  private confirmCallback: (() => void) | null = null;

  openConfirmDialog(title: string, message: string, onConfirm: () => void): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.confirmCallback = onConfirm;
    this.modalVisible = true;
  }

  confirm(): void {
    if (this.confirmCallback) {
      this.confirmCallback();
    }
    this.closeModal();
  }

  closeModal(): void {
    this.modalVisible = false;
    this.modalTitle = '';
    this.modalMessage = '';
    this.confirmCallback = null;
  }
}
