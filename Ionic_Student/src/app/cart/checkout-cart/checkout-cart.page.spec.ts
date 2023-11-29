import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutCartPage } from './checkout-cart.page';

describe('CheckoutCartPage', () => {
  let component: CheckoutCartPage;
  let fixture: ComponentFixture<CheckoutCartPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CheckoutCartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
