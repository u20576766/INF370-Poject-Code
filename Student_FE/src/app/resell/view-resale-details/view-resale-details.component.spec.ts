import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResaleDetailsComponent } from './view-resale-details.component';

describe('ViewResaleDetailsComponent', () => {
  let component: ViewResaleDetailsComponent;
  let fixture: ComponentFixture<ViewResaleDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewResaleDetailsComponent]
    });
    fixture = TestBed.createComponent(ViewResaleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
