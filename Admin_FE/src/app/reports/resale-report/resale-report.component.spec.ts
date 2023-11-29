import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResaleReportComponent } from './resale-report.component';

describe('ResaleReportComponent', () => {
  let component: ResaleReportComponent;
  let fixture: ComponentFixture<ResaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResaleReportComponent]
    });
    fixture = TestBed.createComponent(ResaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
