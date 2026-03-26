import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { KlantenService } from '../Services/KlantenService';
import { Klant } from '../Models/Klant';

@Component({
  selector: 'app-klant-overzicht',
  imports: [RouterLink, DatePipe],
  templateUrl: './klant-overzicht.html',
  styleUrl: './klant-overzicht.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KlantOverzicht implements OnInit {
  private readonly klantenService = inject(KlantenService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly klant = signal<Klant | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.klantenService.getKlant(id).subscribe(k => this.klant.set(k));
  }

  protected gaTerug(): void {
    this.router.navigate(['/klanten']);
  }
}
