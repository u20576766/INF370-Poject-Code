export interface BookReport {
    $id: string;
    $values: BookReportItem[];
  }
  
  export interface BookReportItem {
    
    quantity_On_Hand: number;
    isbn: string;
    title: string;
    basePrice: number;
    price: number;
  }
  