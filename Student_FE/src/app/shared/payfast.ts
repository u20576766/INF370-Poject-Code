export class PaymentResponse {
    paymentInfo: PaymentInfo[] = [];
    redirectUrl: string = '';
  }
  
  export class PaymentInfo {
    merchant_id: number = 0;
    merchant_key: string = '';
    amount: number = 0;
    item_name: string = '';
    signature: string = '';
    email_address: string = '';
    cell_number: string = '';
  }
  

  