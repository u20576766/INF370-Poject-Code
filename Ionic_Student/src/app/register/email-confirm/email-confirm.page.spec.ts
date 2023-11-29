import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailConfirmPage } from './email-confirm.page';

describe('EmailConfirmPage', () => {
  let component: EmailConfirmPage;
  let fixture: ComponentFixture<EmailConfirmPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EmailConfirmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
