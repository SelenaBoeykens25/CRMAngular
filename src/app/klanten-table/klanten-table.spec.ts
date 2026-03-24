import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KlantenTable } from './klanten-table';

describe('KlantenTable', () => {
  let component: KlantenTable;
  let fixture: ComponentFixture<KlantenTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KlantenTable],
    }).compileComponents();

    fixture = TestBed.createComponent(KlantenTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
