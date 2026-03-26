import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from '../Services/AccountService';
import { AuthService } from '../Services/AuthService';
import { GebruikersAccount, createGebruikersAccount } from '../Models/GebruikersAccount';

@Component({
  selector: 'app-nieuw-account',
  imports: [FormsModule],
  templateUrl: './nieuw-account.html',
  styleUrl: './nieuw-account.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NieuwAccount implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly account = signal<GebruikersAccount>(createGebruikersAccount());
  protected readonly bevestigWachtwoord = signal('');
  protected readonly error = signal('');
  protected readonly isOwner = this.authService.isOwner;

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.account.update(a => ({ ...a, email: decodeURIComponent(email) }));
    }
  }

  protected opslaan(): void {
    this.error.set('');
    if (this.account().wachtwoord !== this.bevestigWachtwoord()) {
      this.error.set('Wachtwoorden komen niet overeen.');
      return;
    }
    this.accountService.addAccount(this.account()).subscribe({
      next: result => {
        if (result === null) {
          this.error.set('Account aanmaken mislukt.');
          return;
        }
        this.router.navigate(['/nieuwaccount', this.account().email]);
      },
      error: err => this.error.set(this.toErrorMessage(err, 'Account aanmaken mislukt.')),
    });
  }

  private toErrorMessage(err: unknown, fallback: string): string {
    if (!(err instanceof HttpErrorResponse)) {
      return fallback;
    }

    const body = err.error as unknown;
    if (typeof body === 'string' && body.trim() !== '') {
      return `${fallback} (${err.status}): ${body}`;
    }

    let detail = '';
    if (body !== null && typeof body === 'object' && !Array.isArray(body)) {
      const problem = body as {
        title?: unknown;
        detail?: unknown;
        errors?: unknown;
      };

      if (problem.errors && typeof problem.errors === 'object' && !Array.isArray(problem.errors)) {
        const validationMessage = Object.entries(problem.errors)
          .map(([field, messages]) => {
            const lijst = Array.isArray(messages)
              ? messages.filter((m): m is string => typeof m === 'string')
              : [];
            return lijst.length > 0 ? `${field}: ${lijst.join(', ')}` : '';
          })
          .filter(Boolean)
          .join(' | ');

        if (validationMessage) {
          detail = validationMessage;
        }
      }

      if (!detail && typeof problem.detail === 'string') {
        detail = problem.detail;
      }
      if (!detail && typeof problem.title === 'string') {
        detail = problem.title;
      }
    }

    detail = detail || err.message;
    return `${fallback} (${err.status}): ${detail}`;
  }
}
