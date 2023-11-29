import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateScheduleSlotComponent } from './update-schedule-slot.component';

describe('UpdateScheduleSlotComponent', () => {
  let component: UpdateScheduleSlotComponent;
  let fixture: ComponentFixture<UpdateScheduleSlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateScheduleSlotComponent]
    });
    fixture = TestBed.createComponent(UpdateScheduleSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
