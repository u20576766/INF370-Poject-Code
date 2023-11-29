export class Equips{
  $id: string = '';
  $values: Equipment[] = [];
}

export class Equipment {
  $id: number = 0;
  equipment_ID: number = 0;
  name: string = "";
  description: string = "";
  quantity_On_Hand: number = 0;
  image: string = "";
  module_Code: string = "";
  equipmentType_Name: string = "";
  vatAmount: number =0;
  amountWithoutVAT:number =0;
  amountWithVAT:number =0;
}



