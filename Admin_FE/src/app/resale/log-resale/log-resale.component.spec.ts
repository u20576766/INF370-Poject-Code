import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogResaleComponent } from './log-resale.component';

describe('LogResaleComponent', () => {
  let component: LogResaleComponent;
  let fixture: ComponentFixture<LogResaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LogResaleComponent]
    });
    fixture = TestBed.createComponent(LogResaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
