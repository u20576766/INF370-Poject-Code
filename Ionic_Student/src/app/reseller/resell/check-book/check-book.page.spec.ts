import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckBookPage } from './check-book.page';

describe('CheckBookPage', () => {
  let component: CheckBookPage;
  let fixture: ComponentFixture<CheckBookPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CheckBookPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
