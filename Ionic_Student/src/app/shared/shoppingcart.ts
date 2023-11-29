import { OrderLine } from "./order";
import { Books, Book } from "./books";

export class ShoppingCart {
  $id: string = "";
  shoppingCart: {
    $id: string;
    shoppingCart_ID: number;
    subTotal: number;
    count: number;
    totalAmount: number;
    studentId: number;
    discount: number;
    shoppingCartBook: ShoppingCartBook[];
    shoppingCartEquipment: ShoppingCartEquipment[];
    orderLine: OrderLine | null;
  } = {
      $id: "",
      shoppingCart_ID: 0,
      subTotal: 0,
      count: 0,
      studentId: 0,
      totalAmount: 0,
      discount: 0,
      shoppingCartBook: [],
      shoppingCartEquipment: [],
      orderLine: null,
    };
  subTotal: number = 0;
  count: number = 0;
  discount: number = 0;
  totalAmount: number = 0;
  shoppingCart_ID: number = 0;
}


export class BookItems {
  $id: string = "";
  $values: ShoppingCartBook[] = [];
}

export class ShoppingCartBook {
  $id: string = "";
  book_ID: number = 0;
  shoppingCart_ID: number = 0;
  title: string = "";
  image: string = "";
  price: number = 0;
  quantity: number = 0;
}


export class EquipmentItems {
  $id: string = "";
  $values: ShoppingCartEquipment[] = [];
}

export class ShoppingCartEquipment {
  $id: string = "";
  shoppingCart_ID: number = 0;
  equipment_ID: number = 0;
  image: string = "";
  price: number = 0;
  name: string = "";
  quantity: number = 0;
}
