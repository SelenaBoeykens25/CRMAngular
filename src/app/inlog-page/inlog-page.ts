import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../Services/AccountService';
import { AuthService } from '../Services/AuthService';

@Component({
  selector: 'app-inlog-page',
  imports: [FormsModule],
  templateUrl: './inlog-page.html',
  styleUrl: './inlog-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlogPage {
  private readonly accountService = inject(AccountService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly email = signal('');
  protected readonly wachtwoord = signal('');
  protected readonly error = signal('');
  protected readonly isLoading = signal(false);
  protected readonly showAccountsTable = signal(false);

  protected toggleAccountsTable(): void {
    this.showAccountsTable.update(value => !value);
  }

  protected async login(): Promise<void> {
    this.error.set('');
    this.isLoading.set(true);
    this.accountService.login(this.email(), this.wachtwoord()).subscribe({
      next: account => {
        if (account) {
          this.authService.login(account.email, account.securityLevel);
          this.router.navigate(['/']);
        } else {
          this.error.set('Onbekende gebruiker of fout wachtwoord.');
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Inloggen mislukt. Controleer uw gegevens.');
        this.isLoading.set(false);
      },
    });
  }
}
