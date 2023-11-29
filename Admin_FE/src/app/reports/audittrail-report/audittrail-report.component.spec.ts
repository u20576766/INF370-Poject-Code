import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudittrailReportComponent } from './audittrail-report.component';

describe('AudittrailReportComponent', () => {
  let component: AudittrailReportComponent;
  let fixture: ComponentFixture<AudittrailReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AudittrailReportComponent]
    });
    fixture = TestBed.createComponent(AudittrailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
