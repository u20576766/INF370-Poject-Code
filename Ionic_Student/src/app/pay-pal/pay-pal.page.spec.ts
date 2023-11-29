import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PayPalPage } from './pay-pal.page';

describe('PayPalPage', () => {
  let component: PayPalPage;
  let fixture: ComponentFixture<PayPalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PayPalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
