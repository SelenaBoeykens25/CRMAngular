import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { NgClass, DecimalPipe } from '@angular/common';
import { FactuurService } from '../Services/FactuurService';
import { Factuur } from '../Models/Factuur';

@Component({
  selector: 'app-factuur-details',
  imports: [RouterLink, NgClass, DecimalPipe],
  templateUrl: './factuur-details.html',
  styleUrl: './factuur-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactuurDetails implements OnInit {
  private readonly factuurService = inject(FactuurService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly factuur = signal<Factuur | null>(null);

  protected readonly nettoTotaal = computed(() => {
    const lijnen = this.factuur()?.factuurLijnen ?? [];
    return lijnen.reduce((sum, l) => sum + l.nettoPrijs, 0);
  });

  protected readonly totaalBtw = computed(() => {
    const lijnen = this.factuur()?.factuurLijnen ?? [];
    return lijnen.reduce((sum, l) => sum + (l.brutoPrijs - l.nettoPrijs), 0);
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.factuurService.getFactuur(id).subscribe(f => this.factuur.set(f));
  }

  protected gaTerug(): void {
    this.router.navigate(['/facturen']);
  }

  protected print(): void {
    window.print();
  }

  protected getStatusClass(): string {
    switch (this.factuur()?.betaalStatus) {
      case 'Betaald': return 'alert-success';
      case 'Openstaand': return 'alert-warning';
      case 'Mislukt':
      case 'Geannuleerd': return 'alert-danger';
      default: return 'alert-secondary';
    }
  }
}
