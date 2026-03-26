import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { FactuurDetails } from './factuur-details';
import { FactuurService } from '../Services/FactuurService';

describe('FactuurDetails', () => {
  let component: FactuurDetails;
  let fixture: ComponentFixture<FactuurDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactuurDetails],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {}, paramMap: convertToParamMap({ id: '1' }) } },
        },
        {
          provide: FactuurService,
          useValue: {
            getFactuur: () => of(null),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FactuurDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
