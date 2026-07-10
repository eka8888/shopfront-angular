import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EmailSubscriptionService {
  async subscribe(email: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.info(`Email "${email}" успешно "отправлен"`);
  }
}
