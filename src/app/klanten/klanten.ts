import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { KlantenService } from '../Services/KlantenService';
import { Klant } from '../Models/Klant';
import { KlantFilter } from '../klant-filter/klant-filter';
import { KlantenTable } from '../klanten-table/klanten-table';

@Component({
  selector: 'app-klanten',
  imports: [RouterLink, KlantFilter, KlantenTable],
  templateUrl: './klanten.html',
  styleUrl: './klanten.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Klanten implements OnInit {
  private readonly klantenService = inject(KlantenService);
  private readonly route = inject(ActivatedRoute);

  protected readonly klantenLijst = signal<Klant[]>([]);
  protected readonly filterLijst = signal<Klant[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly queryParams = signal<Record<string, string>>({});

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams as Record<string, string>;
    this.queryParams.set({ ...params });
    this.klantenService.getKlanten().subscribe(klanten => {
      this.klantenLijst.set(klanten);
      this.filterLijst.set(klanten);
      this.isLoading.set(false);
    });
  }

  protected handleFilterChanged(filtered: Klant[]): void {
    this.filterLijst.set(filtered);
  }
}
