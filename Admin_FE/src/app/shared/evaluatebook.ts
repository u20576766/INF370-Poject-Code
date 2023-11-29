export interface Book {
  referenceNum: string;
  title: string;
  isbn: string;
  estimatedPrice: number;
  authors:string;
  date:Date;
  edition:number;
  imageBack:string;
imageBinder:string;
imageFront:string;
imageOpen:string;
publisherName:string;
resellerBookId:number;
bookingID:number;
  // Add more properties if needed
}
