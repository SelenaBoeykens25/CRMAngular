import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlantAanpassen } from './klant-aanpassen';

describe('KlantAanpassen', () => {
  let component: KlantAanpassen;
  let fixture: ComponentFixture<KlantAanpassen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlantAanpassen],
    }).compileComponents();

    fixture = TestBed.createComponent(KlantAanpassen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
