import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTakeEquipmentComponent } from './stock-take-equipment.component';

describe('StockTakeEquipmentComponent', () => {
  let component: StockTakeEquipmentComponent;
  let fixture: ComponentFixture<StockTakeEquipmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockTakeEquipmentComponent]
    });
    fixture = TestBed.createComponent(StockTakeEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
