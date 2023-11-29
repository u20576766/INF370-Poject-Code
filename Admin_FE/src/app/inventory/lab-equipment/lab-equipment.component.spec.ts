import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabEquipmentComponent } from './lab-equipment.component';

describe('LabEquipmentComponent', () => {
  let component: LabEquipmentComponent;
  let fixture: ComponentFixture<LabEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabEquipmentComponent]
    });
    fixture = TestBed.createComponent(LabEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
