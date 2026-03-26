import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { BETAAL_STATUS_OPTIES, BetaalStatus, createFactuur, Factuur } from '../Models/Factuur';
import { createFactuurLijn, FactuurLijn } from '../Models/FactuurLijn';
import { createKlant, Klant } from '../Models/Klant';
import { BTWPercantage } from '../Models/BTWPercantage';

@Injectable({ providedIn: 'root' })
export class FactuurService {
  private readonly http = inject(HttpClient);

  private readonly basePath = 'Factuur';

  private readonly statusToIndex = new Map<BetaalStatus, number>(
    BETAAL_STATUS_OPTIES.map((status, index) => [status, index])
  );

  getFacturen(): Observable<Factuur[]> {
    return this.http
      .get<unknown>(this.basePath)
      .pipe(map(payload => this.toFactuurList(payload)))
      .pipe(catchError(() => of([])));
  }

  getPercentages(): Observable<BTWPercantage[]> {
    return this.http
      .get<unknown>(`${this.basePath}/percentages`)
      .pipe(map(payload => this.toBtwPercentages(payload)))
      .pipe(catchError(() => of([])));
  }

  getFactuur(id: number): Observable<Factuur | null> {
    return this.http
      .get<unknown>(`${this.basePath}/${id}`)
      .pipe(map(payload => this.toFactuur(payload)))
      .pipe(catchError(() => of(null)));
  }

  updateFactuur(factuur: Factuur): Observable<Factuur | null> {
    return this.http.put<Factuur | null>(`${this.basePath}/${factuur.id}`, this.toWriteModel(factuur));
  }

  addFactuur(factuur: Factuur): Observable<Factuur | null> {
    return this.http.post<Factuur | null>(this.basePath, this.toWriteModel(factuur));
  }

  deleteFactuur(id: number): Observable<void> {
    return this.http.delete<void>(`factuur/${id}`);
  }

  private toFactuurList(payload: unknown): Factuur[] {
    const lijst = this.extractArray(payload);
    return lijst.map(item => this.toFactuur(item)).filter((item): item is Factuur => item !== null);
  }

  private toFactuur(payload: unknown): Factuur | null {
    const record = this.asRecord(payload);
    if (record === null) {
      return null;
    }

    return createFactuur({
      id: this.readNumber(record, ['id', 'Id']),
      klantId: this.readNumber(record, ['klantId', 'KlantId']),
      klant: this.toKlant(record['klant'] ?? record['Klant']),
      factuurDatum: this.readString(record, ['factuurDatum', 'FactuurDatum']),
      teBetalenVoor: this.readString(record, ['teBetalenVoor', 'TeBetalenVoor']),
      prijs: this.readNumber(record, ['prijs', 'Prijs']),
      beschrijving: this.readString(record, ['beschrijving', 'Beschrijving']),
      betaalStatus: this.toBetaalStatus(record['betaalStatus'] ?? record['BetaalStatus'] ?? record['betaalstatus']),
      factuurLijnen: this.toFactuurLijnen(record['factuurLijnen'] ?? record['FactuurLijnen']),
    });
  }

  private toKlant(payload: unknown): Klant | null {
    const record = this.asRecord(payload);
    if (record === null) {
      return null;
    }

    return createKlant({
      id: this.readNumber(record, ['id', 'Id']),
      voornaam: this.readString(record, ['voornaam', 'Voornaam']),
      naam: this.readString(record, ['naam', 'Naam']),
      aanspreking: this.readString(record, ['aanspreking', 'Aanspreking']),
      telefoonNummer: this.readString(record, ['telefoonNummer', 'TelefoonNummer']),
      emailAdres: this.readString(record, ['emailAdres', 'EmailAdres']),
      geboorteDatum: this.readString(record, ['geboorteDatum', 'GeboorteDatum']),
      adresId: this.readNullableNumber(record, ['adresId', 'AdresId']),
      facturen: [],
    });
  }

  private toFactuurLijnen(payload: unknown): FactuurLijn[] {
    return this.extractArray(payload).map(lijn => {
      const record = this.asRecord(lijn);
      if (record === null) {
        return createFactuurLijn();
      }

      return createFactuurLijn({
        id: this.readNumber(record, ['id', 'Id']),
        factuurId: this.readNumber(record, ['factuurId', 'FactuurId']),
        omschrijving: this.readString(record, ['omschrijving', 'Omschrijving']),
        nettoPrijs: this.readNumber(record, ['nettoPrijs', 'NettoPrijs']),
        btwPercentage: this.readNumber(record, ['btwPercentage', 'BtwPercentage']),
        brutoPrijs: this.readNumber(record, ['brutoPrijs', 'BrutoPrijs']),
      });
    });
  }

  private toBtwPercentages(payload: unknown): BTWPercantage[] {
    return this.extractArray(payload)
      .map(item => {
        const record = this.asRecord(item);
        if (record === null) {
          return null;
        }

        return {
          id: this.readNumber(record, ['id', 'Id']),
          percentage: this.readNumber(record, ['percentage', 'Percentage', 'percantage', 'Percantage']),
        };
      })
      .filter((item): item is BTWPercantage => item !== null);
  }

  private toBetaalStatus(payload: unknown): BetaalStatus {
    if (typeof payload === 'string') {
      const match = BETAAL_STATUS_OPTIES.find(status => status.toLowerCase() === payload.toLowerCase());
      if (match) {
        return match;
      }
    }

    if (typeof payload === 'number') {
      const status = BETAAL_STATUS_OPTIES[payload];
      if (status) {
        return status;
      }
    }

    return 'Openstaand';
  }

  private extractArray(payload: unknown): unknown[] {
    if (Array.isArray(payload)) {
      return payload;
    }

    const record = this.asRecord(payload);
    if (record === null) {
      return [];
    }

    const mogelijkeLijsten = [record['results'], record['items'], record['data']];
    const lijst = mogelijkeLijsten.find(Array.isArray);
    return Array.isArray(lijst) ? lijst : [];
  }

  private asRecord(payload: unknown): Record<string, unknown> | null {
    return payload !== null && typeof payload === 'object' && !Array.isArray(payload)
      ? (payload as Record<string, unknown>)
      : null;
  }

  private readString(record: Record<string, unknown>, keys: string[]): string {
    const value = this.readValue(record, keys);
    return typeof value === 'string' ? value : '';
  }

  private readNumber(record: Record<string, unknown>, keys: string[]): number {
    const value = this.readValue(record, keys);
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === 'string') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private readNullableNumber(record: Record<string, unknown>, keys: string[]): number | null {
    const value = this.readValue(record, keys);
    if (value === null) {
      return null;
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : null;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
  }

  private readValue(record: Record<string, unknown>, keys: string[]): unknown {
    for (const key of keys) {
      if (key in record) {
        return record[key];
      }
    }
    return undefined;
  }

  private toWriteModel(factuur: Factuur): Record<string, unknown> {
    return {
      id: factuur.id,
      klantId: factuur.klantId,
      factuurDatum: factuur.factuurDatum,
      teBetalenVoor: factuur.teBetalenVoor,
      prijs: factuur.prijs,
      beschrijving: factuur.beschrijving,
      betaalStatus: this.statusToIndex.get(factuur.betaalStatus) ?? 0,
      factuurLijnen: factuur.factuurLijnen.map(lijn => ({
        id: lijn.id,
        factuurId: lijn.factuurId,
        omschrijving: lijn.omschrijving,
        nettoPrijs: lijn.nettoPrijs,
        btwPercentage: lijn.btwPercentage,
        brutoPrijs: lijn.brutoPrijs,
      })),
    };
  }
}
