import { ChangeDetectionStrategy, Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Factuur } from '../Models/Factuur';
import { FactuurService } from '../Services/FactuurService';
import { BetaalStatus } from '../Models/Factuur';

interface BetaalStatusData {
  status: BetaalStatus;
  aantal: number;
}

@Component({
  selector: 'app-betaal-status-overzicht',
  imports: [RouterLink],
  templateUrl: './betaal-status-overzicht.html',
  styleUrl: './betaal-status-overzicht.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BetaalStatusOverzicht implements OnInit {
  private readonly factuurService = inject(FactuurService);
  readonly factuurLijst = input<Factuur[] | null>(null);
  protected readonly data = signal<BetaalStatusData[] | null>(null);

  ngOnInit(): void {
    const inputFacturen = this.factuurLijst();
    if (inputFacturen && inputFacturen.length > 0) {
      this.zetData(inputFacturen);
      return;
    }

    this.factuurService.getFacturen().subscribe(facturen => this.zetData(facturen));
  }

  private zetData(facturen: Factuur[]): void {
    const grouped = facturen.reduce<Record<string, number>>((acc, f) => {
      acc[f.betaalStatus] = (acc[f.betaalStatus] ?? 0) + 1;
      return acc;
    }, {});
    const result = (Object.entries(grouped) as [BetaalStatus, number][])
      .map(([status, aantal]) => ({ status, aantal }))
      .sort((a, b) => a.status.localeCompare(b.status));
    this.data.set(result);
  }

  protected getLabel(status: BetaalStatus): string {
    const labels: Record<BetaalStatus, string> = {
      Openstaand: 'Openstaand',
      InBehandeling: 'In Behandeling',
      Betaald: 'Betaald',
      Mislukt: 'Mislukt',
      Geannuleerd: 'Geannuleerd',
    };
    return labels[status] ?? status;
  }
}
