import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeeTypeComponent } from './update-employee-type.component';

describe('UpdateEmployeeTypeComponent', () => {
  let component: UpdateEmployeeTypeComponent;
  let fixture: ComponentFixture<UpdateEmployeeTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEmployeeTypeComponent]
    });
    fixture = TestBed.createComponent(UpdateEmployeeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
