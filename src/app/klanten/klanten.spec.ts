import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Klanten } from './klanten';
import { KlantenService } from '../Services/KlantenService';

describe('Klanten', () => {
  let component: Klanten;
  let fixture: ComponentFixture<Klanten>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Klanten],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {}, paramMap: convertToParamMap({ id: '1' }) } },
        },
        {
          provide: KlantenService,
          useValue: {
            getKlanten: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Klanten);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
