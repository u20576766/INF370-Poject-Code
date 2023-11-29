import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPresBookComponent } from './add-pres-book.component';

describe('AddPresBookComponent', () => {
  let component: AddPresBookComponent;
  let fixture: ComponentFixture<AddPresBookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPresBookComponent]
    });
    fixture = TestBed.createComponent(AddPresBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
