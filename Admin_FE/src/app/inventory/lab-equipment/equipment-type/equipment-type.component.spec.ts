import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentTypeComponent } from './equipment-type.component';

describe('EquipmentTypeComponent', () => {
  let component: EquipmentTypeComponent;
  let fixture: ComponentFixture<EquipmentTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipmentTypeComponent]
    });
    fixture = TestBed.createComponent(EquipmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
