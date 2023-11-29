import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateBooksComponent } from './evaluate-books.component';

describe('EvaluateBooksComponent', () => {
  let component: EvaluateBooksComponent;
  let fixture: ComponentFixture<EvaluateBooksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluateBooksComponent]
    });
    fixture = TestBed.createComponent(EvaluateBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
