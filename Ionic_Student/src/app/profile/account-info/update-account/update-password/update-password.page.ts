import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {
  hide = true;
  hide2 = true;
  hide3 = true;
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  constructor() { }

  ngOnInit() {
  }

  togglePassword() {
    this.hide = !this.hide;
  }

  togglePassword2() {
    this.hide2 = !this.hide2;
  }

  togglePassword3() {
    this.hide3 = !this.hide3;
  }
}
