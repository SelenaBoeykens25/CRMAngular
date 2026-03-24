import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlantFilter } from './klant-filter';

describe('KlantFilter', () => {
  let component: KlantFilter;
  let fixture: ComponentFixture<KlantFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlantFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(KlantFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
