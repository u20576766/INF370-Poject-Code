import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEquipmentTypeComponent } from './update-equipment-type.component';

describe('UpdateEquipmentTypeComponent', () => {
  let component: UpdateEquipmentTypeComponent;
  let fixture: ComponentFixture<UpdateEquipmentTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEquipmentTypeComponent]
    });
    fixture = TestBed.createComponent(UpdateEquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
