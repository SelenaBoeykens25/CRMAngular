import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { GebruikersAccount, normalizeSecurityLevel, SecurityLevel } from '../Models/GebruikersAccount';

type GebruikersAccountWriteModel = Omit<GebruikersAccount, 'aanmaakDatum' | 'securityLevel'> & {
  aanmaakDatum: string;
  securityLevel: number;
};

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);

  login(email: string, wachtwoord: string): Observable<GebruikersAccount | null> {
    return this.http
      .get<GebruikersAccount & { securityLevel: unknown }>(`account/${email}/${wachtwoord}`)
      .pipe(
        map(account => {
          const securityLevel = normalizeSecurityLevel(account.securityLevel);
          if (!securityLevel) {
            return null;
          }

          return {
            ...account,
            securityLevel,
          };
        }),
        catchError(() => of(null)),
      );
  }

  bestaatAl(email: string): Observable<boolean> {
    return this.http
      .get<boolean>(`/account/${email}`)
      .pipe(catchError(() => of(false)));
  }

  addAccount(account: GebruikersAccount): Observable<GebruikersAccount | null> {
    return this.http.post<GebruikersAccount | null>('Account', this.toWriteModel(account));
  }

  private toWriteModel(account: GebruikersAccount): GebruikersAccountWriteModel {
    return {
      id: account.id,
      email: account.email,
      wachtwoord: account.wachtwoord,
      aanmaakDatum: this.toDateOnlyString(account.aanmaakDatum),
      securityLevel: this.toSecurityLevelValue(account.securityLevel),
    };
  }

  private toDateOnlyString(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toSecurityLevelValue(value: SecurityLevel): number {
    switch (value) {
      case 'User':
        return 0;
      case 'Admin':
        return 1;
      case 'Owner':
        return 2;
    }
  }
}
