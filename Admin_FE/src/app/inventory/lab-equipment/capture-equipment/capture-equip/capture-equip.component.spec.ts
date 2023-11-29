import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureEquipComponent } from './capture-equip.component';

describe('CaptureEquipComponent', () => {
  let component: CaptureEquipComponent;
  let fixture: ComponentFixture<CaptureEquipComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CaptureEquipComponent]
    });
    fixture = TestBed.createComponent(CaptureEquipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
