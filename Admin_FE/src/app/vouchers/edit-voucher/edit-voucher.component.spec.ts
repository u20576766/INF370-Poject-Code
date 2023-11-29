import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVoucherComponent } from './edit-voucher.component';

describe('EditVoucherComponent', () => {
  let component: EditVoucherComponent;
  let fixture: ComponentFixture<EditVoucherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditVoucherComponent]
    });
    fixture = TestBed.createComponent(EditVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
