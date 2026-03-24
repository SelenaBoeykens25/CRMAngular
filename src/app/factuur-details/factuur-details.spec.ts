import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactuurDetails } from './factuur-details';

describe('FactuurDetails', () => {
  let component: FactuurDetails;
  let fixture: ComponentFixture<FactuurDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactuurDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(FactuurDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
