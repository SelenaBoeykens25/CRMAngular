import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { KlantenService } from '../Services/KlantenService';

@Component({
  selector: 'app-delete-confirm',
  imports: [RouterLink],
  templateUrl: './delete-confirm.html',
  styleUrl: './delete-confirm.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirm implements OnInit {
  private readonly klantenService = inject(KlantenService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = signal(0);
  protected readonly naam = signal('');

  ngOnInit(): void {
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
    this.naam.set(decodeURIComponent(this.route.snapshot.paramMap.get('naam') ?? ''));
  }

  protected bevestig(): void {
    this.klantenService.deleteKlant(this.id()).subscribe(() =>
      this.router.navigate(['/klanten'])
    );
  }
}
