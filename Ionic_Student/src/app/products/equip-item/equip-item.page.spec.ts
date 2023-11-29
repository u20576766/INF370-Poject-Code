import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipItemPage } from './equip-item.page';

describe('EquipItemPage', () => {
  let component: EquipItemPage;
  let fixture: ComponentFixture<EquipItemPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EquipItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
