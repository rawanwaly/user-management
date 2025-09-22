import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FileService {
  download(file: Blob, filename: string): void {
    const url = window.URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
