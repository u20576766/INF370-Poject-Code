import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'; // Import SweetAlert
import { Equipment, Equips } from '../shared/equipment2';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShoppingCart, ShoppingCartEquipment } from '../shared/shoppingcart';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipment-item',
  templateUrl: './equipment-item.component.html',
  styleUrls: ['./equipment-item.component.scss']
})
export class EquipmentItemComponent implements OnInit {

  equipList: Equipment[] = [];
  shoppingCart: ShoppingCart | null = null;
  studentId = localStorage.getItem('studentId');
  sID = parseInt(this.studentId ?? '0', 10);
  passedequipmentID :any | null = null;
  selectedEquip: Equipment | undefined;

  constructor(private activatedRoute:ActivatedRoute,private data: DataService, private router: Router, private snackbar: MatSnackBar) { }


  GetAllEquipments() {
    this.data.GetEquipments().subscribe(
      (result: Equips) => {
        this.equipList = result.$values;
        console.log(this.passedequipmentID)
        this.selectedEquip = this.equipList.find(e => e.equipment_ID == this.passedequipmentID);
        console.log('Equipment:',this.selectedEquip)

      },
      (error: any) => {
        console.error('Error fetching equipment:', error);
        // Show error SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a server error loading the equipment',
        });
      }
    );
  }


  ngOnInit(): void {
    this.GetAllEquipments();
    this.activatedRoute.params.subscribe(params => {
      const equipmentId = params['id'];
      this.passedequipmentID = equipmentId;
    });

  }




  AddToCart(equipment_ID: number) {
    const selectedEquip = this.equipList.find(e => e.equipment_ID === equipment_ID);
    console.log(selectedEquip)

    if (selectedEquip) {
      let ecart = new ShoppingCartEquipment();
      ecart.equipment_ID = selectedEquip.equipment_ID;

      // Calculate the total price based on the book's price from the bookList
      const totalPrice = selectedEquip.amountWithVAT * ecart.quantity;
      console.log(selectedEquip.equipment_ID)

      this.data.AddEquipToCart(this.sID, ecart).subscribe(
        (response: any) => {
          this.data.getShoppingCart(this.sID);
          this.snackbar.open('Equipment Added To Cart Successfully', 'OK', {
            duration: 3000,
            verticalPosition: 'top'
          });
        },
        (error: any) => {
          console.error('Error adding equipment to cart:', error);
          // Show error SweetAlert
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Failed to add equipment to cart',
            timer: 1500
          });
        }
      );
    } else {
      console.error('Equipment not found in equipList');
      // Show error SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Equipment not found in the list',
      });
    }
  }
}
