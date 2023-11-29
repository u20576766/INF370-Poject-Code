import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHelptipComponent } from './edit-helptip.component';

describe('EditHelptipComponent', () => {
  let component: EditHelptipComponent;
  let fixture: ComponentFixture<EditHelptipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHelptipComponent]
    });
    fixture = TestBed.createComponent(EditHelptipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
