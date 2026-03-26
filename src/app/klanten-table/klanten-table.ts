import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Klant } from '../Models/Klant';

@Component({
  selector: 'app-klanten-table',
  imports: [RouterLink],
  templateUrl: './klanten-table.html',
  styleUrl: './klanten-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlantenTable {
  readonly filterLijst = input<Klant[]>([]);
}
