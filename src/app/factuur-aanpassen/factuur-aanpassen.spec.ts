import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { FactuurAanpassen } from './factuur-aanpassen';
import { FactuurService } from '../Services/FactuurService';
import { KlantenService } from '../Services/KlantenService';

describe('FactuurAanpassen', () => {
  let component: FactuurAanpassen;
  let fixture: ComponentFixture<FactuurAanpassen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactuurAanpassen],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {}, paramMap: convertToParamMap({ id: '0' }) } },
        },
        {
          provide: FactuurService,
          useValue: {
            getFactuur: () => of(null),
            getPercentages: () => of([]),
            updateFactuur: () => of(null),
            addFactuur: () => of(null),
          },
        },
        {
          provide: KlantenService,
          useValue: {
            getKlanten: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FactuurAanpassen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
