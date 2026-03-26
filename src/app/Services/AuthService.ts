import { computed, Injectable, signal } from '@angular/core';
import { normalizeSecurityLevel, SecurityLevel } from '../Models/GebruikersAccount';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _email = signal<string | null>(localStorage.getItem('loggedInEmail'));
  private readonly _level = signal<SecurityLevel | null>(normalizeSecurityLevel(localStorage.getItem('securityLevel')));

  readonly isAuthenticated = computed(() => !!this._email());
  readonly isAdminOrOwner = computed(() => {
    const l = this._level();
    return l === 'Admin' || l === 'Owner';
  });
  readonly isOwner = computed(() => this._level() === 'Owner');

  login(email: string, securityLevel: unknown): void {
    const normalizedSecurityLevel = normalizeSecurityLevel(securityLevel);

    localStorage.setItem('loggedInEmail', email);
    this._email.set(email);

    if (normalizedSecurityLevel) {
      localStorage.setItem('securityLevel', normalizedSecurityLevel);
    } else {
      localStorage.removeItem('securityLevel');
    }

    this._level.set(normalizedSecurityLevel);
  }

  logout(): void {
    localStorage.removeItem('loggedInEmail');
    localStorage.removeItem('securityLevel');
    this._email.set(null);
    this._level.set(null);
  }

  getEmail(): string | null {
    return this._email();
  }
}
