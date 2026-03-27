import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Grafiek } from './grafiek';
import { FactuurService } from '../Services/FactuurService';

describe('Grafiek', () => {
  let component: Grafiek;
  let fixture: ComponentFixture<Grafiek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grafiek],
      providers: [
        {
          provide: FactuurService,
          useValue: {
            getFacturen: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Grafiek);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
