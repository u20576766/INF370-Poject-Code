export class Order{
    $id: string = "";
    order_ID: number = 0;
    order_Reference_Number: string = "";
    order_Date: string = "";
    order_Total: number = 0;
    collector_Name: string = "";
    date_Of_Collection: string = "";
    student_ID:number = 0;
    order_Status_ID: number = 0;
}


export class OrderLine{
    $id: string = "";
    item_ID: number = 0;
    order_ID: number = 0;
    itemName: string = "";
    price: number = 0;
    equipment_ID: number = 0;
    book_ID: number = 0;
    quantity: number = 0;
}