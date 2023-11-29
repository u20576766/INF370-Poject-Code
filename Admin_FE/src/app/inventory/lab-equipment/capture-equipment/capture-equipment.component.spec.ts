import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureEquipmentComponent } from './capture-equipment.component';

describe('CaptureEquipmentComponent', () => {
  let component: CaptureEquipmentComponent;
  let fixture: ComponentFixture<CaptureEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptureEquipmentComponent]
    });
    fixture = TestBed.createComponent(CaptureEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
