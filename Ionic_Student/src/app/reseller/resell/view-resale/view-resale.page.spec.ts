import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewResalePage } from './view-resale.page';

describe('ViewResalePage', () => {
  let component: ViewResalePage;
  let fixture: ComponentFixture<ViewResalePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ViewResalePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
