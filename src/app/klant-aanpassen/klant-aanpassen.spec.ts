import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { KlantAanpassen } from './klant-aanpassen';
import { KlantenService } from '../Services/KlantenService';
import { LandService } from '../Services/LandService';

describe('KlantAanpassen', () => {
  let component: KlantAanpassen;
  let fixture: ComponentFixture<KlantAanpassen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlantAanpassen],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {}, paramMap: convertToParamMap({ id: '0' }) } },
        },
        {
          provide: KlantenService,
          useValue: {
            getKlant: () => of(null),
            getKlanten: () => of([]),
            updateKlant: () => of(null),
            addKlant: () => of(null),
          },
        },
        {
          provide: LandService,
          useValue: {
            getLanden: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KlantAanpassen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
