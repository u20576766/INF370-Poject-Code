import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReportComponent } from './book-report.component';

describe('BookReportComponent', () => {
  let component: BookReportComponent;
  let fixture: ComponentFixture<BookReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookReportComponent]
    });
    fixture = TestBed.createComponent(BookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
