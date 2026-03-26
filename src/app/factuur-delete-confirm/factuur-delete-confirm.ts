import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FactuurService } from '../Services/FactuurService';

@Component({
  selector: 'app-factuur-delete-confirm',
  imports: [RouterLink],
  templateUrl: './factuur-delete-confirm.html',
  styleUrl: './factuur-delete-confirm.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FactuurDeleteConfirm implements OnInit {
  private readonly factuurService = inject(FactuurService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly id = signal(0);

  ngOnInit(): void {
    this.id.set(Number(this.route.snapshot.paramMap.get('id')));
  }

  protected bevestig(): void {
    this.factuurService.deleteFactuur(this.id()).subscribe(() =>
      this.router.navigate(['/facturen'])
    );
  }
}
