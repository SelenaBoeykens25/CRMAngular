import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactuurAanpassen } from './factuur-aanpassen';

describe('FactuurAanpassen', () => {
  let component: FactuurAanpassen;
  let fixture: ComponentFixture<FactuurAanpassen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactuurAanpassen],
    }).compileComponents();

    fixture = TestBed.createComponent(FactuurAanpassen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
