import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account-toegevoegd',
  imports: [RouterLink],
  templateUrl: './account-toegevoegd.html',
  styleUrl: './account-toegevoegd.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountToegevoegd implements OnInit {
  private readonly route = inject(ActivatedRoute);
  protected readonly email = signal('');

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    this.email.set(email ? decodeURIComponent(email) : '');
  }
}
