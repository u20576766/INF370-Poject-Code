export class Equipment {
  $id: string = "";
  $values: Equi[] = [];
}

export class Equi {
  $id: number = 0;
  equipment_ID: number = 0;
  amount: number = 0;
  date_Last_Updated: string = "";
  description: string = "";
  equipment_Types: {
    name: string;
    modules: {
      module_Code: string;
    };
  } = {
    name: "",
    modules: {
      module_Code: "",
    },
  };
  image: string = "";
  module_Code: string = "";
  name: string = "";
  quantity_On_Hand: number = 0;
}
