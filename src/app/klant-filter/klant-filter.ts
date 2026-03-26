import { ChangeDetectionStrategy, Component, input, OnChanges, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Klant } from '../Models/Klant';

@Component({
  selector: 'app-klant-filter',
  imports: [FormsModule],
  templateUrl: './klant-filter.html',
  styleUrl: './klant-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlantFilter implements OnChanges {
  readonly klantenLijst = input<Klant[]>([]);
  readonly initialQueryParams = input<Record<string, string>>({});
  readonly filterChanged = output<Klant[]>();

  protected filterText = '';
  protected filterOp = 'Naam';

  ngOnChanges(): void {
    const params = this.initialQueryParams();
    if (Object.keys(params).length > 0) {
      if (params['filterOp']) this.filterOp = params['filterOp'];
      if (params['filter']) this.filterText = params['filter'];
      this.handleFilter();
    }
  }

  protected handleFilter(): void {
    const lijst = this.klantenLijst();
    const text = this.filterText.toLowerCase();
    if (!text) {
      this.filterChanged.emit(lijst);
      return;
    }
    const filtered = lijst.filter(k => {
      switch (this.filterOp) {
        case 'Naam': return `${k.voornaam} ${k.naam}`.toLowerCase().includes(text);
        case 'Email': return k.emailAdres.toLowerCase().includes(text);
        case 'Telefoon': return k.telefoonNummer.toLowerCase().includes(text);
        case 'Adres': return k.adres != null &&
          `${k.adres.straat ?? ''} ${k.adres.huisnummer ?? ''} ${k.adres.busnummer ?? ''} ${k.adres.stad ?? ''}`.toLowerCase().includes(text);
        default: return true;
      }
    });
    this.filterChanged.emit(filtered);
  }
}
