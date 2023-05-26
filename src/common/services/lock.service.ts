import { Injectable } from '@nestjs/common';

@Injectable()
export class LockService {
  private isLocked = false;

  async acquireLock(): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkLock = async () => {
        if (this.isLocked) {
          setTimeout(checkLock, 10);
        } else {
          this.isLocked = true;
          resolve();
        }
      };

      checkLock();
    });
  }

  releaseLock(): void {
    this.isLocked = false;
  }
}
