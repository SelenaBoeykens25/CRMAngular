import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactuurTable } from './factuur-table';

describe('FactuurTable', () => {
  let component: FactuurTable;
  let fixture: ComponentFixture<FactuurTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactuurTable],
    }).compileComponents();

    fixture = TestBed.createComponent(FactuurTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
