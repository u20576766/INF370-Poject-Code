import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescribedBookComponent } from './prescribed-book.component';

describe('PrescribedBookComponent', () => {
  let component: PrescribedBookComponent;
  let fixture: ComponentFixture<PrescribedBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrescribedBookComponent]
    });
    fixture = TestBed.createComponent(PrescribedBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
