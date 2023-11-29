import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEquipmentTypeComponent } from './add-equipment-type.component';

describe('AddEquipmentTypeComponent', () => {
  let component: AddEquipmentTypeComponent;
  let fixture: ComponentFixture<AddEquipmentTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEquipmentTypeComponent]
    });
    fixture = TestBed.createComponent(AddEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
