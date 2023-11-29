import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBookEstimateComponent } from './check-book-estimate.component';

describe('CheckBookEstimateComponent', () => {
  let component: CheckBookEstimateComponent;
  let fixture: ComponentFixture<CheckBookEstimateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckBookEstimateComponent]
    });
    fixture = TestBed.createComponent(CheckBookEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
