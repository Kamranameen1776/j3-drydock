import { HtmlCell } from '../../interfaces/html-cell';

export interface SpecificationCostUpdateDto {
  uid: string;
  subject: string;
  status: string;
  itemNumber: string;
  description: string;
  subItemUid: string;
  subItemSubject: string;
  subItemDescription: string;
  subItemCost: number;
  subItemUtilized: number;
}

export interface SpecificationCostUpdate {
  specificationUid: string;
  subject: string;
  status: HtmlCell;
  estimatedCost: number;
  code: string;
  variance: HtmlCell;
}

export interface SpecificationSubItemCostUpdate {
  specificationUid?: string;
  subItemUid: string;
  subItemSubject: string;
  estimatedCost: number;
  utilizedCost: number;
  variance: HtmlCell;
}

export class SubItemUtilized {
  uid: string;
  utilized: number;
}

export class UpdateCostsDto {
  subItems: SubItemUtilized[];
  specificationDetailsUid: string;
}
