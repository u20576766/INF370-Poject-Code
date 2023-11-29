import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalkinsaleReportComponent } from './walkinsale-report.component';

describe('WalkinsaleReportComponent', () => {
  let component: WalkinsaleReportComponent;
  let fixture: ComponentFixture<WalkinsaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WalkinsaleReportComponent]
    });
    fixture = TestBed.createComponent(WalkinsaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
