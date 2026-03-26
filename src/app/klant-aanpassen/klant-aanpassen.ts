import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { KlantenService } from '../Services/KlantenService';
import { LandService } from '../Services/LandService';
import { Klant, createKlant } from '../Models/Klant';
import { Adres, createAdres } from '../Models/Adres';
import { Land, createLand } from '../Models/Land';

@Component({
  selector: 'app-klant-aanpassen',
  imports: [FormsModule],
  templateUrl: './klant-aanpassen.html',
  styleUrl: './klant-aanpassen.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlantAanpassen implements OnInit {
  private readonly klantenService = inject(KlantenService);
  private readonly landService = inject(LandService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = signal(0);
  protected readonly klant = signal<Klant>(createKlant());
  protected readonly metAdres = signal(false);
  protected readonly nieuwLand = signal(false);
  protected readonly mogelijkeLanden = signal<Land[]>([]);
  protected readonly error = signal('');

  ngOnInit(): void {
    const idParam = Number(this.route.snapshot.paramMap.get('id') ?? '0');
    this.id.set(idParam);
    if (idParam !== 0) {
      this.klantenService.getKlant(idParam).subscribe(k => {
        if (k) {
          this.klant.set(k);
          if (k.adres) {
            this.metAdres.set(true);
            this.landService.getLanden().subscribe(l => this.mogelijkeLanden.set(l));
          }
        }
      });
    }
  }

  protected voegAdresToe(): void {
    const adres = createAdres();
    this.klant.update(k => ({ ...k, adres }));
    this.metAdres.set(true);
    this.landService.getLanden().subscribe(landen => {
      this.mogelijkeLanden.set(landen);
      if (landen.length > 0) {
        this.klant.update(k => ({ ...k, adres: { ...k.adres!, landcode: landen[0].landCode } }));
      }
    });
  }

  protected nieuwLandToevoegen(): void {
    this.klant.update(k => ({ ...k, adres: { ...k.adres!, land: createLand() } }));
    this.nieuwLand.set(true);
  }

  protected updateAdresField(field: keyof Adres, value: unknown): void {
    this.klant.update(k => ({ ...k, adres: { ...k.adres!, [field]: value } }));
  }

  protected opslaan(): void {
    this.error.set('');
    let klantData = this.klant();
    if (this.nieuwLand() && klantData.adres?.land) {
      klantData = { ...klantData, adres: { ...klantData.adres, landcode: klantData.adres.land.landCode } };
    }
    if (this.id() !== 0) {
      this.klantenService.updateKlant(klantData).subscribe({
        next: () => this.router.navigate(['/klanten', klantData.id]),
        error: err => this.error.set(this.toErrorMessage(err, 'Klant opslaan mislukt.')),
      });
    } else {
      this.klantenService.addKlant(klantData).subscribe({
        next: result => {
          if (result === null) {
            this.error.set('Klant opslaan mislukt.');
            return;
          }
          this.router.navigate(['/klanten']);
        },
        error: err => {
          if (this.isBackendCreateFalseNegative(err)) {
            this.router.navigate(['/klanten']);
            return;
          }
          this.error.set(this.toErrorMessage(err, 'Klant opslaan mislukt.'));
        },
      });
    }
  }

  protected gaTerug(): void {
    this.router.navigate(['/klanten']);
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

  private isBackendCreateFalseNegative(err: unknown): boolean {
    if (!(err instanceof HttpErrorResponse) || err.status !== 500) {
      return false;
    }

    const body = err.error;
    if (typeof body !== 'string') {
      return false;
    }

    return body.includes('No route matches the supplied values');
  }

}
