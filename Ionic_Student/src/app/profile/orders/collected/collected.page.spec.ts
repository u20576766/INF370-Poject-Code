import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectedPage } from './collected.page';

describe('CollectedPage', () => {
  let component: CollectedPage;
  let fixture: ComponentFixture<CollectedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CollectedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
