export class Books {
    $id: string = '';
    $values: Book[] = [];
  }
  
  export class Book {
    $id: number = 0;
    book_ID: number = 0;
    isbn: string = '';
    quantity: number = 0;
    imageBase64: string ="";
    price: number = 0;
    title: string = '';
    publisherName: string = '';
    module_Code: string = '';
    edition: number = 0;
    year: number = 0;
    authorName: string = '';
  }
  
  