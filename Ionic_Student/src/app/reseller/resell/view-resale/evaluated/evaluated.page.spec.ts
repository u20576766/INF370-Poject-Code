import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluatedPage } from './evaluated.page';

describe('EvaluatedPage', () => {
  let component: EvaluatedPage;
  let fixture: ComponentFixture<EvaluatedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EvaluatedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
