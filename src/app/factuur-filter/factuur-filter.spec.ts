import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactuurFilter } from './factuur-filter';

describe('FactuurFilter', () => {
  let component: FactuurFilter;
  let fixture: ComponentFixture<FactuurFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactuurFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(FactuurFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
