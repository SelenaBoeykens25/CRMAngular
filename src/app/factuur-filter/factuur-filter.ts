import { ChangeDetectionStrategy, Component, input, OnChanges, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Factuur, BetaalStatus, BETAAL_STATUS_OPTIES } from '../Models/Factuur';

@Component({
  selector: 'app-factuur-filter',
  imports: [FormsModule],
  templateUrl: './factuur-filter.html',
  styleUrl: './factuur-filter.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactuurFilter implements OnChanges {
  readonly factuurLijst = input<Factuur[]>([]);
  readonly initialQueryParams = input<Record<string, string>>({});
  readonly filterChanged = output<Factuur[]>();

  protected filterOp = 'Klant';
  protected filterText = '';
  protected vergelijkingsOperator = '=';
  protected filterNummer = 0;
  protected filterStatus: BetaalStatus = 'Openstaand';
  protected filterDatumSoort = 'Dag';
  protected filterDag = new Date().toISOString().split('T')[0] ?? '';
  protected filterMaand = new Date().getMonth() + 1;
  protected filterJaar = new Date().getFullYear();
  protected readonly betaalStatusOpties = BETAAL_STATUS_OPTIES;

  ngOnChanges(): void {
    const params = this.initialQueryParams();
    if (Object.keys(params).length > 0) {
      if (params['filterOp']) this.filterOp = params['filterOp'];
      if (params['klant']) this.filterText = params['klant'];
      if (params['status']) this.filterStatus = params['status'] as BetaalStatus;
      if (params['operator']) this.vergelijkingsOperator = params['operator'];
      if (params['nummer']) this.filterNummer = +params['nummer'];
      if (params['prijs']) this.filterNummer = +params['prijs'];
      if (params['aantal']) this.filterNummer = +params['aantal'];
      if (params['datumSoort']) this.filterDatumSoort = params['datumSoort'];
      if (params['jaar']) this.filterJaar = +params['jaar'];
      if (params['maand']) this.filterMaand = +params['maand'];
      if (params['dag']) this.filterDag = params['dag'];
      this.handleFilter();
    }
  }

  protected handleFilter(): void {
    const lijst = this.factuurLijst();
    let filtered: Factuur[];
    switch (this.filterOp) {
      case 'Nummer':
        filtered = this.numericFilter(lijst, f => f.id, this.filterNummer);
        break;
      case 'Klant':
        filtered = this.filterText
          ? lijst.filter(f => `${f.klant?.voornaam ?? ''} ${f.klant?.naam ?? ''}`.toLowerCase().includes(this.filterText.toLowerCase()))
          : lijst;
        break;
      case 'Status':
        filtered = lijst.filter(f => f.betaalStatus === this.filterStatus);
        break;
      case 'Prijs':
        filtered = this.numericFilter(lijst, f => f.prijs, this.filterNummer);
        break;
      case 'Aantal':
        filtered = this.numericFilter(lijst, f => f.factuurLijnen.length, this.filterNummer);
        break;
      case 'Datum':
        filtered = this.datumFilter(lijst, f => f.factuurDatum);
        break;
      case 'TBV':
        filtered = this.datumFilter(lijst, f => f.teBetalenVoor);
        break;
      default:
        filtered = lijst;
    }
    this.filterChanged.emit(filtered);
  }

  private numericFilter(lijst: Factuur[], selector: (f: Factuur) => number, value: number): Factuur[] {
    switch (this.vergelijkingsOperator) {
      case '>': return lijst.filter(f => selector(f) > value);
      case '<': return lijst.filter(f => selector(f) < value);
      default: return lijst.filter(f => selector(f) === value);
    }
  }

  private datumFilter(lijst: Factuur[], selector: (f: Factuur) => string): Factuur[] {
    switch (this.filterDatumSoort) {
      case 'Dag': return lijst.filter(f => selector(f) === this.filterDag);
      case 'Maand': return lijst.filter(f => {
        const d = new Date(selector(f));
        return d.getMonth() + 1 === this.filterMaand && d.getFullYear() === this.filterJaar;
      });
      case 'Jaar': return lijst.filter(f => new Date(selector(f)).getFullYear() === this.filterJaar);
      default: return lijst;
    }
  }
}
