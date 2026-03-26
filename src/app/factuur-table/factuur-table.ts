import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Factuur, BETAAL_STATUS_OPTIES } from '../Models/Factuur';
import { FactuurService } from '../Services/FactuurService';

@Component({
  selector: 'app-factuur-table',
  imports: [RouterLink, FormsModule],
  templateUrl: './factuur-table.html',
  styleUrl: './factuur-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactuurTable {
  private readonly factuurService = inject(FactuurService);
  readonly filterLijst = input<Factuur[]>([]);
  protected readonly betaalStatusOpties = BETAAL_STATUS_OPTIES;

  protected statusClass(status: string): string {
    return status.toLowerCase();
  }

  protected pasStatusAan(factuur: Factuur): void {
    this.factuurService.updateFactuur(factuur).subscribe();
  }
}
