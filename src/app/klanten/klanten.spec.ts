import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Klanten } from './klanten';

describe('Klanten', () => {
  let component: Klanten;
  let fixture: ComponentFixture<Klanten>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Klanten],
    }).compileComponents();

    fixture = TestBed.createComponent(Klanten);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
