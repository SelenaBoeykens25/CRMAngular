import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Klant } from '../Models/Klant';
import { Adres } from '../Models/Adres';

type AdresWriteModel = Record<string, unknown>;
interface KlantWriteModel extends Omit<Klant, 'facturen' | 'adres'> {
  adres: AdresWriteModel | null;
}

@Injectable({ providedIn: 'root' })
export class KlantenService {
  private readonly http = inject(HttpClient);

  getKlanten(): Observable<Klant[]> {
    return this.http
      .get<Klant[]>('klant')
      .pipe(catchError(() => of([])));
  }

  getKlant(id: number): Observable<Klant | null> {
    return this.http
      .get<Klant>(`klant/${id}`)
      .pipe(catchError(() => of(null)));
  }

  updateKlant(klant: Klant): Observable<Klant | null> {
    return this.http.put<Klant | null>(`Klant/${klant.id}`, this.toWriteModel(klant));
  }

  addKlant(klant: Klant): Observable<Klant | null> {
    return this.http.post<Klant | null>('Klant', this.toWriteModel(klant));
  }

  deleteKlant(id: number): Observable<void> {
    return this.http.delete<void>(`klant/${id}`);
  }

  private toWriteModel(klant: Klant): KlantWriteModel {
    const adres = klant.adres as (Adres & {
      huisNummer?: string;
      busNummer?: string;
      landCode?: string;
    }) | null;

    const huisNummer = adres?.huisnummer ?? adres?.huisNummer ?? '';
    const busNummer = adres?.busnummer ?? adres?.busNummer ?? '';
    const landCode = adres?.landcode ?? adres?.landCode ?? '';

    return {
      id: klant.id,
      voornaam: klant.voornaam,
      naam: klant.naam,
      aanspreking: klant.aanspreking,
      telefoonNummer: klant.telefoonNummer,
      emailAdres: klant.emailAdres,
      geboorteDatum: klant.geboorteDatum,
      adres: adres
        ? {
            id: adres.id,
            straat: adres.straat,
            huisNummer,
            huisnummer: huisNummer,
            busNummer,
            busnummer: busNummer,
            postcode: adres.postcode,
            gemeente: adres.gemeente,
            stad: adres.stad,
            provincie: adres.provincie,
            landCode,
            landcode: landCode,
          }
        : null,
      adresId: klant.adresId,
    };
  }
}
