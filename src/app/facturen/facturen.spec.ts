import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Facturen } from './facturen';
import { FactuurService } from '../Services/FactuurService';

describe('Facturen', () => {
  let component: Facturen;
  let fixture: ComponentFixture<Facturen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Facturen],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams: {}, paramMap: convertToParamMap({ id: '1' }) } },
        },
        {
          provide: FactuurService,
          useValue: {
            getFacturen: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Facturen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
