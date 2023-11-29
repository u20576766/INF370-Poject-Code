import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLabEquipmentComponent } from './add-lab-equipment.component';

describe('AddLabEquipmentComponent', () => {
  let component: AddLabEquipmentComponent;
  let fixture: ComponentFixture<AddLabEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLabEquipmentComponent]
    });
    fixture = TestBed.createComponent(AddLabEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
