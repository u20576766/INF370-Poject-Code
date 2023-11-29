import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendNewsletterComponent } from './send-newsletter.component';

describe('SendNewsletterComponent', () => {
  let component: SendNewsletterComponent;
  let fixture: ComponentFixture<SendNewsletterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendNewsletterComponent]
    });
    fixture = TestBed.createComponent(SendNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
