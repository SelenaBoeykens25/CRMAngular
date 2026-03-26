import { Routes } from '@angular/router';
import { adminOrOwnerGuard, authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home), canActivate: [authGuard] },
  { path: 'login', loadComponent: () => import('./inlog-page/inlog-page').then(m => m.InlogPage) },
  { path: 'klanten', loadComponent: () => import('./klanten/klanten').then(m => m.Klanten), canActivate: [authGuard] },
  { path: 'klanten/aanpassen', loadComponent: () => import('./klant-aanpassen/klant-aanpassen').then(m => m.KlantAanpassen), canActivate: [authGuard] },
  { path: 'klanten/toevoegen', loadComponent: () => import('./klant-aanpassen/klant-aanpassen').then(m => m.KlantAanpassen), canActivate: [authGuard] },
  { path: 'klanten/aanpassen/:id', loadComponent: () => import('./klant-aanpassen/klant-aanpassen').then(m => m.KlantAanpassen), canActivate: [authGuard] },
  { path: 'klanten/deleteconfirm/:id/:naam', loadComponent: () => import('./delete-confirm/delete-confirm').then(m => m.DeleteConfirm), canActivate: [authGuard] },
  { path: 'klanten/:id', loadComponent: () => import('./klant-overzicht/klant-overzicht').then(m => m.KlantOverzicht), canActivate: [authGuard] },
  { path: 'facturen', loadComponent: () => import('./facturen/facturen').then(m => m.Facturen), canActivate: [authGuard] },
  { path: 'facturen/aanpassen', loadComponent: () => import('./factuur-aanpassen/factuur-aanpassen').then(m => m.FactuurAanpassen), canActivate: [authGuard] },
  { path: 'facturen/toevoegen', loadComponent: () => import('./factuur-aanpassen/factuur-aanpassen').then(m => m.FactuurAanpassen), canActivate: [authGuard] },
  { path: 'facturen/aanpassen/:id', loadComponent: () => import('./factuur-aanpassen/factuur-aanpassen').then(m => m.FactuurAanpassen), canActivate: [authGuard] },
  { path: 'facturen/deleteconfirm/:id', loadComponent: () => import('./factuur-delete-confirm/factuur-delete-confirm').then(m => m.FactuurDeleteConfirm), canActivate: [authGuard] },
  { path: 'facturen/:id', loadComponent: () => import('./factuur-details/factuur-details').then(m => m.FactuurDetails), canActivate: [authGuard] },
  { path: 'nieuwaccount', loadComponent: () => import('./nieuw-account/nieuw-account').then(m => m.NieuwAccount), canActivate: [adminOrOwnerGuard] },
  { path: 'nieuwaccount/:email', loadComponent: () => import('./account-toegevoegd/account-toegevoegd').then(m => m.AccountToegevoegd), canActivate: [adminOrOwnerGuard] },
  { path: 'not-found', loadComponent: () => import('./not-found/not-found').then(m => m.NotFound) },
  { path: '**', redirectTo: 'not-found' },
];

