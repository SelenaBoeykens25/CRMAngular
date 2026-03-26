import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FactuurService } from '../Services/FactuurService';
import { KlantenService } from '../Services/KlantenService';
import { Factuur, BETAAL_STATUS_OPTIES, createFactuur } from '../Models/Factuur';
import { FactuurLijn, createFactuurLijn } from '../Models/FactuurLijn';
import { Klant } from '../Models/Klant';
import { BTWPercantage } from '../Models/BTWPercantage';

@Component({
  selector: 'app-factuur-aanpassen',
  imports: [FormsModule],
  templateUrl: './factuur-aanpassen.html',
  styleUrl: './factuur-aanpassen.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactuurAanpassen implements OnInit {
  private readonly factuurService = inject(FactuurService);
  private readonly klantenService = inject(KlantenService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = signal(0);
  protected readonly factuur = signal<Factuur>(createFactuur());
  protected readonly mogelijkeKlanten = signal<Klant[]>([]);
  protected readonly btwPercentages = signal<BTWPercantage[]>([]);
  protected readonly showDropdown = signal(false);
  protected readonly dropdownFilter = signal('');
  protected readonly selectedKlantNaam = signal('');
  protected readonly error = signal('');
  protected readonly betaalStatusOpties = BETAAL_STATUS_OPTIES;

  protected readonly gefilterdeKlanten = computed(() => {
    const filter = this.dropdownFilter().toLowerCase();
    if (!filter) return this.mogelijkeKlanten();
    return this.mogelijkeKlanten().filter(k =>
      `${k.voornaam} ${k.naam}`.toLowerCase().includes(filter)
    );
  });

  ngOnInit(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id') ?? '0');
    this.id.set(idParam);

    this.klantenService.getKlanten().subscribe(k => this.mogelijkeKlanten.set(k));
    this.factuurService.getPercentages().subscribe(p => this.btwPercentages.set(p));

    if (idParam !== 0) {
      this.factuurService.getFactuur(idParam).subscribe(f => {
        if (f) {
          this.factuur.set(f);
          const klant = this.mogelijkeKlanten().find(k => k.id === f.klantId);
          if (klant) this.selectedKlantNaam.set(`${klant.voornaam} ${klant.naam}`);
        }
      });
    }
  }

  protected onDropdownFilterChange(value: string): void {
    this.dropdownFilter.set(value);
  }

  protected showDropdownMenu(): void { this.showDropdown.set(true); }

  protected hideDropdownDelayed(): void {
    setTimeout(() => this.showDropdown.set(false), 200);
  }

  protected selectKlant(klant: Klant): void {
    this.factuur.update(f => ({ ...f, klantId: klant.id }));
    this.selectedKlantNaam.set(`${klant.voornaam} ${klant.naam}`);
    this.dropdownFilter.set('');
    this.showDropdown.set(false);
  }

  protected onNettoPrijsChanged(index: number, value: unknown): void {
    const nettoPrijs = this.toNumber(value);
    this.factuur.update(f => {
      const factuurLijnen = [...f.factuurLijnen];
      const huidigeLijn = factuurLijnen[index];
      if (!huidigeLijn) {
        return f;
      }

      const btwPercentage = this.toNumber(huidigeLijn.btwPercentage);
      const brutoPrijs = this.berekenBrutoPrijs(nettoPrijs, btwPercentage);

      factuurLijnen[index] = {
        ...huidigeLijn,
        nettoPrijs,
        brutoPrijs,
      };

      return {
        ...f,
        factuurLijnen,
        prijs: this.berekenTotaalPrijs(factuurLijnen),
      };
    });
  }

  protected onBtwChanged(index: number, value: unknown): void {
    const btwPercentage = this.toNumber(value);
    this.factuur.update(f => {
      const factuurLijnen = [...f.factuurLijnen];
      const huidigeLijn = factuurLijnen[index];
      if (!huidigeLijn) {
        return f;
      }

      const nettoPrijs = this.toNumber(huidigeLijn.nettoPrijs);
      const brutoPrijs = this.berekenBrutoPrijs(nettoPrijs, btwPercentage);

      factuurLijnen[index] = {
        ...huidigeLijn,
        btwPercentage,
        brutoPrijs,
      };

      return {
        ...f,
        factuurLijnen,
        prijs: this.berekenTotaalPrijs(factuurLijnen),
      };
    });
  }

  protected onBrutoPrijsChanged(index: number, value: unknown): void {
    const brutoPrijs = this.toNumber(value);
    this.factuur.update(f => {
      const factuurLijnen = [...f.factuurLijnen];
      const huidigeLijn = factuurLijnen[index];
      if (!huidigeLijn) {
        return f;
      }

      const btwPercentage = this.toNumber(huidigeLijn.btwPercentage);
      const nettoPrijs = this.berekenNettoPrijs(brutoPrijs, btwPercentage);

      factuurLijnen[index] = {
        ...huidigeLijn,
        nettoPrijs,
        brutoPrijs,
      };

      return {
        ...f,
        factuurLijnen,
        prijs: this.berekenTotaalPrijs(factuurLijnen),
      };
    });
  }

  private zetTotaalPrijs(): void {
    const lijnen = this.factuur().factuurLijnen;
    this.factuur.update(f => ({ ...f, prijs: this.berekenTotaalPrijs(lijnen) }));
  }

  protected nieuweLijn(): void {
    const percentages = this.btwPercentages();
    const defaultBtw = percentages.length > 0 ? percentages[percentages.length - 1].percentage : 21;
    const lijn = createFactuurLijn({ btwPercentage: defaultBtw, brutoPrijs: this.berekenBrutoPrijs(0, defaultBtw) });
    this.factuur.update(f => {
      const factuurLijnen = [...f.factuurLijnen, lijn];
      return { ...f, factuurLijnen, prijs: this.berekenTotaalPrijs(factuurLijnen) };
    });
  }

  protected verwijderLijn(lijn: FactuurLijn): void {
    this.factuur.update(f => ({ ...f, factuurLijnen: f.factuurLijnen.filter(l => l !== lijn) }));
    this.zetTotaalPrijs();
  }

  protected updateOmschrijving(index: number, value: string): void {
    this.factuur.update(f => {
      const factuurLijnen = [...f.factuurLijnen];
      const huidigeLijn = factuurLijnen[index];
      if (!huidigeLijn) {
        return f;
      }

      factuurLijnen[index] = {
        ...huidigeLijn,
        omschrijving: value,
      };

      return { ...f, factuurLijnen };
    });
  }

  protected opslaan(): void {
    this.error.set('');
    const id = this.id();
    if (id !== 0) {
      this.factuurService.updateFactuur(this.factuur()).subscribe({
        next: () => this.router.navigate(['/facturen', this.factuur().id]),
        error: err => this.error.set(this.toErrorMessage(err, 'Factuur opslaan mislukt.')),
      });
    } else {
      this.factuurService.addFactuur(this.factuur()).subscribe({
        next: result => {
          if (result === null) {
            this.error.set('Factuur opslaan mislukt.');
            return;
          }
          this.router.navigate(['/facturen']);
        },
        error: err => this.error.set(this.toErrorMessage(err, 'Factuur opslaan mislukt.')),
      });
    }
  }

  protected gaTerug(): void {
    this.router.navigate(['/facturen']);
  }

  private toErrorMessage(err: unknown, fallback: string): string {
    if (!(err instanceof HttpErrorResponse)) {
      return fallback;
    }

    const body = err.error as unknown;
    if (typeof body === 'string' && body.trim() !== '') {
      return `${fallback} (${err.status}): ${body}`;
    }

    let detail = '';
    if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
      const problem = body as {
        title?: unknown;
        detail?: unknown;
        errors?: unknown;
      };

      if (problem.errors && typeof problem.errors === 'object' && !Array.isArray(problem.errors)) {
        const validationMessage = Object.entries(problem.errors)
          .map(([field, messages]) => {
            const lijst = Array.isArray(messages)
              ? messages.filter((m): m is string => typeof m === 'string')
              : [];
            return lijst.length > 0 ? `${field}: ${lijst.join(', ')}` : '';
          })
          .filter(Boolean)
          .join(' | ');

        if (validationMessage) {
          detail = validationMessage;
        }
      }

      if (!detail && typeof problem.detail === 'string') {
        detail = problem.detail;
      }
      if (!detail && typeof problem.title === 'string') {
        detail = problem.title;
      }
    }

    detail = detail || err.message;
    return `${fallback} (${err.status}): ${detail}`;
  }

  private berekenBrutoPrijs(nettoPrijs: number, btwPercentage: number): number {
    return Math.round(nettoPrijs * (1 + btwPercentage / 100) * 100) / 100;
  }

  private berekenNettoPrijs(brutoPrijs: number, btwPercentage: number): number {
    if (btwPercentage <= -100) {
      return 0;
    }

    return Math.round((brutoPrijs / (1 + btwPercentage / 100)) * 100) / 100;
  }

  private berekenTotaalPrijs(lijnen: FactuurLijn[]): number {
    const totaal = lijnen.reduce((sum, lijn) => sum + this.toNumber(lijn.brutoPrijs), 0);
    return Math.round(totaal * 100) / 100;
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }

    if (typeof value === 'string') {
      const normalized = value.replace(',', '.').trim();
      if (normalized === '') {
        return 0;
      }

      const parsed = Number(normalized);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    return 0;
  }

}
