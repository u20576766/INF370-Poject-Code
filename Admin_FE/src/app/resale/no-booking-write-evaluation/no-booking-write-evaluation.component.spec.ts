import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoBookingWriteEvaluationComponent } from './no-booking-write-evaluation.component';

describe('NoBookingWriteEvaluationComponent', () => {
  let component: NoBookingWriteEvaluationComponent;
  let fixture: ComponentFixture<NoBookingWriteEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoBookingWriteEvaluationComponent]
    });
    fixture = TestBed.createComponent(NoBookingWriteEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
