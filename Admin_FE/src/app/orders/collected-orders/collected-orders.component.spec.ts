import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedOrdersComponent } from './collected-orders.component';

describe('CollectedOrdersComponent', () => {
  let component: CollectedOrdersComponent;
  let fixture: ComponentFixture<CollectedOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectedOrdersComponent]
    });
    fixture = TestBed.createComponent(CollectedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
