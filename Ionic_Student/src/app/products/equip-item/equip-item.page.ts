import { Component, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { AlertController } from '@ionic/angular'; // Import Ionic's AlertController
import { Equipment, Equips } from 'src/app/shared/equipment2';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { ShoppingCart, ShoppingCartEquipment } from 'src/app/shared/shoppingcart';

@Component({
  selector: 'app-equip-item',
  templateUrl: './equip-item.page.html',
  styleUrls: ['./equip-item.page.scss'],
})
export class EquipItemPage implements OnInit {

  //Equipment
  equipList: Equipment[] = [];
  shoppingCart: ShoppingCart | null = null;
  studentId = localStorage.getItem('studentId');
  sID = parseInt(this.studentId ?? '0', 10);
  passedequipmentID :any | null = null;
  selectedEquip: Equipment | undefined;

  constructor(
    private animationController: AnimationController,
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController, // Use Ionic's AlertController
    private toastController: ToastController) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      const id = +params['id'];
      this.passedequipmentID = id;

      this.GetAllEquipments();
    });
   }

  //Equipment Stuff
  async AddToECart(equipment_ID: number) {
    const selectedEquip = this.equipList.find(e => e.equipment_ID === equipment_ID);

    if (selectedEquip) {
      let ecart = new ShoppingCartEquipment();
      ecart.equipment_ID = selectedEquip.equipment_ID;

      // Calculate the total price based on the book's price from the bookList
      const totalPrice = selectedEquip.amountWithVAT * ecart.quantity;

      this.data.AddEquipToCart(this.sID, ecart).subscribe(
        (response: any) => {
          this.presentToast('Equipment Added To Cart Successfully');
          this.data.getShoppingCart(this.sID);
        },
        (error: any) => {
          console.error('Error adding equipment to cart:', error);
          this.presentAlert('Server Error', 'Failed to add equipment to cart');
        }
      );
    } else {
      console.error('Equipment not found in equipList');
      this.presentAlert('Error', 'Equipment not found in the list');
    }
  }

  GetAllEquipments() {
    this.data.GetEquipments().subscribe(
      (result: Equips) => {
        this.equipList = result.$values;
        this.selectedEquip = this.equipList.find(e => e.equipment_ID == this.passedequipmentID);
        console.log('Equipment:',this.selectedEquip)
      },
      (error: any) => {
        console.error('Error fetching equipment:', error);
        this.presentAlert('Error', 'There was a server error loading the equipment');
      }
    );
  }

  async presentAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'top', // Display the toast at the top
      color: 'success' // Customize the color as needed
    });
    await toast.present();
  }

  ViewItem(eid: number) {
    const selectedEquip = this.equipList.find(e => e.equipment_ID === eid);

    console.log(selectedEquip)
    this.router.navigate(['/equip-item', eid])
  }

}
