import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookItemPage } from './book-item.page';

describe('BookItemPage', () => {
  let component: BookItemPage;
  let fixture: ComponentFixture<BookItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(BookItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
