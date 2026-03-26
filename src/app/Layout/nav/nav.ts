import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Services/AuthService';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Nav {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isDropdownOpen = signal(false);
  protected readonly navCollapsed = signal(true);

  toggleDropdown(): void {
    this.isDropdownOpen.update(v => !v);
  }

  toggleNav(): void {
    this.navCollapsed.update(v => !v);
  }

  logout(): void {
    this.isDropdownOpen.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  closeDropdown(): void {
    this.isDropdownOpen.set(false);
  }
}
