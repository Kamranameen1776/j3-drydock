export interface SpecificationSubItem {
  uid: string;
  specificationDetailsUid: string;
  number: number;
  subject: string;
  unitType: string;
  unitTypeUid: string;
  quantity: number;
  unitPrice: number;
  activeStatus: boolean;
  discount: number;
  description: string;
  dialogHeader: string;
}

export interface CreateSpecificationSubItemData extends SpecificationSubItem {
  pmsJobUid: string[];
  findingUid: string[];
}
