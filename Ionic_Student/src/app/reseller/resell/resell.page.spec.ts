import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ResellPage } from './resell.page';

describe('ResellPage', () => {
  let component: ResellPage;
  let fixture: ComponentFixture<ResellPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResellPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
