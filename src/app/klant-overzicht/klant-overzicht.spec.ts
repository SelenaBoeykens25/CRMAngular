import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { KlantOverzicht } from './klant-overzicht';
import { KlantenService } from '../Services/KlantenService';

describe('KlantOverzicht', () => {
  let component: KlantOverzicht;
  let fixture: ComponentFixture<KlantOverzicht>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlantOverzicht],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {}, paramMap: convertToParamMap({ id: '1' }) } },
        },
        {
          provide: KlantenService,
          useValue: {
            getKlant: () => of(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(KlantOverzicht);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
