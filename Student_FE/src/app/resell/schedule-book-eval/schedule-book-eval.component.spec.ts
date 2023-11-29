import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleBookEvalComponent } from './schedule-book-eval.component';

describe('ScheduleBookEvalComponent', () => {
  let component: ScheduleBookEvalComponent;
  let fixture: ComponentFixture<ScheduleBookEvalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleBookEvalComponent]
    });
    fixture = TestBed.createComponent(ScheduleBookEvalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
