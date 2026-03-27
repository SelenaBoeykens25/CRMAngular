import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FactuurService } from '../Services/FactuurService';
import { Factuur } from '../Models/Factuur';
import { BetaalStatusOverzicht } from '../betaal-status-overzicht/betaal-status-overzicht';
import { Grafiek } from '../grafiek/grafiek';

@Component({
  selector: 'app-home',
  imports: [RouterLink, BetaalStatusOverzicht, Grafiek],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly factuurService = inject(FactuurService);
  protected readonly factuurLijst = signal<Factuur[]>([]);

  ngOnInit(): void {
    this.factuurService.getFacturen().subscribe(f => this.factuurLijst.set(f));
  }
}
