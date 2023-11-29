import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRequestComponent } from './change-request.component';

describe('ChangeRequestComponent', () => {
  let component: ChangeRequestComponent;
  let fixture: ComponentFixture<ChangeRequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangeRequestComponent]
    });
    fixture = TestBed.createComponent(ChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
