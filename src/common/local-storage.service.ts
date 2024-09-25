import { Injectable } from '@nestjs/common';

@Injectable()
export class LocalStorageService {
  private storage: Storage;
  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }
  getItem(key: string): string {
    return this.storage.getItem(key);
  }
}
