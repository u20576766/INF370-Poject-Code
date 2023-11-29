export class Order {
    $id: string = "";
    order_ID: number = 0;
    order_Reference_Number: string = "";
    order_Date: string = "";
    order_Total: number = 0;
    collector_Name: string = "";
    date_Of_Collection: string = "";
    student_ID: number = 0;
    order_Status_ID: number = 0;
    voucher_ID: number = 0;
  }

  export class OrderStatus {
    orderstatus_ID: number = 0;
    statusName: string = "";
    description: string = "";
}

export class OrderLine {
    $id: string = "";
    item_ID: number = 0;
    order_ID: number = 0;
    itemName: string = "";
    price: number = 0;
    equipment: any; // You might want to replace 'any' with an appropriate type if available
    book_ID: number = 0;// You might want to replace 'any' with an appropriate type if available
    quantity: number = 0;
  }
  
  