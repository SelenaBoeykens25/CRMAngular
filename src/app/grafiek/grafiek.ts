import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, Chart, registerables } from 'chart.js';
import { Factuur } from '../Models/Factuur';
import { FactuurService } from '../Services/FactuurService';

Chart.register(...registerables);

interface MaandOverzicht {
  maand: string;
  facturen: number;
  brutoPrijs: number;
}

@Component({
  selector: 'app-grafiek',
  imports: [BaseChartDirective],
  templateUrl: './grafiek.html',
  styleUrl: './grafiek.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grafiek implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  private readonly factuurService = inject(FactuurService);

  readonly loading = signal(true);
  readonly maandOverzicht = signal<MaandOverzicht[]>([]);

  readonly chartConfig = computed<ChartConfiguration<'bar'>>(() => ({
    type: 'bar',
    data: {
      labels: this.maandOverzicht().map(item => item.maand),
      datasets: [
        {
          label: 'Aantal facturen',
          data: this.maandOverzicht().map(item => item.facturen),
          backgroundColor: '#6c757d',
          borderColor: '#6c757d',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: 'Brutoprijs (€)',
          data: this.maandOverzicht().map(item => item.brutoPrijs),
          backgroundColor: '#0d6efd',
          borderColor: '#0d6efd',
          borderWidth: 1,
          yAxisID: 'y',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        title: {
          display: true,
          text: 'Brutoprijs per maand',
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Brutoprijs (€)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: 'Aantal facturen'
          },
          grid: {
            drawOnChartArea: false,
          }
        }
      }
    }
  }));

  ngOnInit(): void {
    this.factuurService.getFacturen().subscribe(facturen => {
      this.maandOverzicht.set(this.bouwMaandOverzicht(facturen));
      this.loading.set(false);
    });
  }

  private bouwMaandOverzicht(facturen: Factuur[]): MaandOverzicht[] {
    const perMaand = new Map<string, MaandOverzicht>();

    for (const factuur of facturen) {
      const maandKey = this.toMonthKey(factuur.factuurDatum);
      if (maandKey === null) {
        continue;
      }

      const huidig = perMaand.get(maandKey) ?? {
        maand: this.toMonthLabel(maandKey),
        facturen: 0,
        brutoPrijs: 0,
      };

      perMaand.set(maandKey, {
        maand: huidig.maand,
        facturen: huidig.facturen + 1,
        brutoPrijs: huidig.brutoPrijs + this.berekenBrutoPrijs(factuur),
      });
    }

    return [...perMaand.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, value]) => ({
        maand: value.maand,
        facturen: value.facturen,
        brutoPrijs: Number(value.brutoPrijs.toFixed(2)),
      }));
  }

  private berekenBrutoPrijs(factuur: Factuur): number {
    if (factuur.factuurLijnen.length > 0) {
      return factuur.factuurLijnen.reduce((som, lijn) => som + lijn.brutoPrijs, 0);
    }

    return factuur.prijs;
  }

  private toMonthKey(datum: string): string | null {
    const isoMatch = /^(\d{4})-(\d{2})/.exec(datum.trim());
    if (isoMatch) {
      return `${isoMatch[1]}-${isoMatch[2]}`;
    }

    const parsed = new Date(datum);
    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  private toMonthLabel(monthKey: string): string {
    const [year, month] = monthKey.split('-');
    const parsed = new Date(Number(year), Number(month) - 1, 1);

    return new Intl.DateTimeFormat('nl-BE', {
      month: 'short',
      year: 'numeric',
    }).format(parsed);
  }
}
