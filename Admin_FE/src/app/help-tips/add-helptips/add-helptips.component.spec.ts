import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHelptipsComponent } from './add-helptips.component';

describe('AddHelptipsComponent', () => {
  let component: AddHelptipsComponent;
  let fixture: ComponentFixture<AddHelptipsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddHelptipsComponent]
    });
    fixture = TestBed.createComponent(AddHelptipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
