export interface SaleItem {
  $id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface SaleDetails {
  $id: string;
  saleID: number;
  saleDate: string;
  saleTotal: number;

  saleItems: {
    $id: string;
    $values: SaleItem[];
  };
}

export interface DateBreakdown {
  $id: string;
  date: string;
  totalOrdersOnDate: number;
  totalRevenueOnDate: number;
  ordersOnDateDetails: {
    $id: string;
    $values: SaleDetails[];
  };
  showDetails: boolean;
}

export interface VoucherDetails {
  $id: string;
  voucherCode: string;
  totalOrdersWithVoucher: number;
  totalDiscountAmountFromVoucher: number;
  ordersWithVoucherDetails: {
    $id: string;
    $values: SaleDetails[];
  };
  showDetails: boolean;
}

export interface FacultyBreakdown {
  $id: string;
  facultyName: string;
  totalBooksSold: number;
  totalRevenueFromBooks: number;
  booksSoldDetails: {
    $id: string;
    $values: {
      $id: string;
      bookTitle: string;
      quantitySold: number;
      revenueGenerated: number;
    }[];
  };
  showDetails: boolean;
}

export interface SaleReport {
  $id: string;
  totalSales: number;
  totalRevenue: number;
  totalItemsSold: number;
  totalDiscountsApplied: number;
  totalBooksSold: number;
  totalEquipmentSold: number;
  totalRevenueFromBooks: number;
  totalRevenueFromEquipment: number;
  facultyBreakdowns: {
    $id: string;
    $values: FacultyBreakdown[];
  };
  dateBreakdowns: {
    $id: string;
    $values: DateBreakdown[];
  };
  voucherBreakdowns: {
    $id: string;
    $values: VoucherDetails[];
  };
}
