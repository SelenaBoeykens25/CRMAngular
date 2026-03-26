import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FactuurService } from '../Services/FactuurService';
import { Factuur } from '../Models/Factuur';
import { FactuurFilter } from '../factuur-filter/factuur-filter';
import { FactuurTable } from '../factuur-table/factuur-table';

@Component({
  selector: 'app-facturen',
  imports: [RouterLink, FactuurFilter, FactuurTable],
  templateUrl: './facturen.html',
  styleUrl: './facturen.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Facturen implements OnInit {
  private readonly factuurService = inject(FactuurService);
  private readonly route = inject(ActivatedRoute);

  protected readonly factuurLijst = signal<Factuur[]>([]);
  protected readonly filterLijst = signal<Factuur[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly queryParams = signal<Record<string, string>>({});

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams as Record<string, string>;
    this.queryParams.set({ ...params });
    this.factuurService.getFacturen().subscribe(facturen => {
      this.factuurLijst.set(facturen);
      this.filterLijst.set(facturen);
      this.isLoading.set(false);
    });
  }

  protected handleFilterChanged(filtered: Factuur[]): void {
    this.filterLijst.set(filtered);
  }
}
