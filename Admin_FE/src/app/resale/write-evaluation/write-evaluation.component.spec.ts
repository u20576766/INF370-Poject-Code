import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteEvaluationComponent } from './write-evaluation.component';

describe('WriteEvaluationComponent', () => {
  let component: WriteEvaluationComponent;
  let fixture: ComponentFixture<WriteEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriteEvaluationComponent]
    });
    fixture = TestBed.createComponent(WriteEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
