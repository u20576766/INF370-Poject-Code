import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogOrderComponent } from './log-order.component';

describe('LogOrderComponent', () => {
  let component: LogOrderComponent;
  let fixture: ComponentFixture<LogOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogOrderComponent]
    });
    fixture = TestBed.createComponent(LogOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
