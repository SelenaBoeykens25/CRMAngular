import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Land } from '../Models/Land';

@Injectable({ providedIn: 'root' })
export class LandService {
  private readonly http = inject(HttpClient);

  getLanden(): Observable<Land[]> {
    return this.http
      .get<Land[]>('land')
      .pipe(catchError(() => of([])));
  }

  addLand(land: Land): Observable<Land | null> {
    return this.http
      .post<Land>('land', land)
      .pipe(catchError(() => of(null)));
  }
}
