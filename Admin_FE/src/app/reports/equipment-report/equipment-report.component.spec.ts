import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentReportComponent } from './equipment-report.component';

describe('EquipmentReportComponent', () => {
  let component: EquipmentReportComponent;
  let fixture: ComponentFixture<EquipmentReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmentReportComponent]
    });
    fixture = TestBed.createComponent(EquipmentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
