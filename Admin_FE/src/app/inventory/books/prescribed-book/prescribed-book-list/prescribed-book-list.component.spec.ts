import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribedBookListComponent } from './prescribed-book-list.component';

describe('PrescribedBookListComponent', () => {
  let component: PrescribedBookListComponent;
  let fixture: ComponentFixture<PrescribedBookListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescribedBookListComponent]
    });
    fixture = TestBed.createComponent(PrescribedBookListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
