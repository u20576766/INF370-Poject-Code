import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedSearchPage } from './advanced-search.page';

describe('AdvancedSearchPage', () => {
  let component: AdvancedSearchPage;
  let fixture: ComponentFixture<AdvancedSearchPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AdvancedSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
