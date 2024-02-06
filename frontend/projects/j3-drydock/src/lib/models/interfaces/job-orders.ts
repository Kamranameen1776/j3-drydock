export interface JobOrder {
  SpecificationUid: string;
  Code: string;
  Progress: number;
  ItemSource: string;
  Responsible: string;
  LastUpdated: Date;
  SpecificationStatus: string;
  SpecificationSubject: string;
  JobOrderRemarks: string;
  JobOrderStatus: string;
  JobOrderSubject: string;
  SpecificationStartDate: string;
  SpecificationEndDate: string;
}
