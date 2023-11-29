export interface UpdateAccountModel {
    firstName: string;
    lastName: string;
    email: string;
    cell_Number: string;
    subscribed: boolean;
  }

  export interface UpdatePasswordModel {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  