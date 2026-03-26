import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationNotificationService {
  private readonly authChanged = new Subject<void>();
  readonly onAuthenticationChanged$ = this.authChanged.asObservable();

  notifyAuthenticationChanged(): void {
    this.authChanged.next();
  }
}
