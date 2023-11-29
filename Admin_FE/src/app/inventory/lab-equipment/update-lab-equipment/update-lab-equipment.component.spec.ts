import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLabEquipmentComponent } from './update-lab-equipment.component';

describe('UpdateLabEquipmentComponent', () => {
  let component: UpdateLabEquipmentComponent;
  let fixture: ComponentFixture<UpdateLabEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateLabEquipmentComponent]
    });
    fixture = TestBed.createComponent(UpdateLabEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
