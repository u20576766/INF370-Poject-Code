import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVatComponent } from './update-vat.component';

describe('UpdateVatComponent', () => {
  let component: UpdateVatComponent;
  let fixture: ComponentFixture<UpdateVatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateVatComponent]
    });
    fixture = TestBed.createComponent(UpdateVatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
