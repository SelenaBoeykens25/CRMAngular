import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlantOverzicht } from './klant-overzicht';

describe('KlantOverzicht', () => {
  let component: KlantOverzicht;
  let fixture: ComponentFixture<KlantOverzicht>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlantOverzicht],
    }).compileComponents();

    fixture = TestBed.createComponent(KlantOverzicht);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
