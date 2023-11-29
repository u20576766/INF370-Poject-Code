export class PayFastRequest {
    merchant_id: number = 0;
    merchant_key: string = "";
    amount: number = 0;
    item_name: string = "";
    signature: string = "";
    email_address: string = "";
    cell_number: string = "";
}
