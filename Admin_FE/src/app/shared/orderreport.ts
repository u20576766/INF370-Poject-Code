export interface  OrderReport {
  $id: string;
  totalOrders: number;
  totalRevenue: number;
  totalItemsSold: number;
  totalDiscountsApplied: number;
  totalBooksSold: number;
  totalEquipmentSold: number;
  totalRevenueFromBooks: number;
  totalRevenueFromEquipment: number;
  orderDateBreakdowns: {
    $id: string;
    $values: OrderDateBreakdown[];
  };
  orderVoucherBreakdowns: {
    $id: string;
    $values: OrderVoucherBreakdown[];
  };
  facultyBreakdowns: {
    $id: string;
    $values: FacultyBreakdown[];
  };
}

export interface OrderDateBreakdown {
  $id: string;
  date: string;
  totalOrdersOnDate: number;
  totalRevenueOnDate: number;
  ordersOnDateDetails: {
    $id: string;
    $values: OrderOnDateDetail[];
  };
}

export interface OrderOnDateDetail {
  $id: string;
  orderID: number;
  orderDate: string;
  orderTotal: number;
  orderItems: {
    $id: string;
    $values: OrderItem[];
  };
}

export interface OrderItem {
  $id: string;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderVoucherBreakdown {
  $id: string;
  voucherCode: string;
  totalOrdersWithVoucher: number;
  totalDiscountAmountFromVoucher: number;
  ordersWithVoucherDetails: {
    $id: string;
    $values: OrderWithVoucherDetail[];
  };
}

export interface OrderWithVoucherDetail {
  $id: string;
  orderID: number;
  orderDate: string;
  orderTotal: number;
  orderItems: {
    $id: string;
    $values: OrderItem[];
  };
}

export interface FacultyBreakdown {
  $id: string;
  facultyName: string;
  totalBooksSold: number;
  totalRevenueFromBooks: number;
  booksSoldDetails: {
    $id: string;
    $values: BookSoldDetail[];
  };
}

export interface BookSoldDetail {
  $id: string;
  bookTitle: string;
  quantitySold: number;
  revenueGenerated: number;
}
