import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookedPage } from './booked.page';

describe('BookedPage', () => {
  let component: BookedPage;
  let fixture: ComponentFixture<BookedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
