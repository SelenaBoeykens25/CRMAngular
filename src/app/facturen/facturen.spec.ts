import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Facturen } from './facturen';

describe('Facturen', () => {
  let component: Facturen;
  let fixture: ComponentFixture<Facturen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Facturen],
    }).compileComponents();

    fixture = TestBed.createComponent(Facturen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
