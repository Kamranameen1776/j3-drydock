export interface IJobOrderDto {
  SpecificationUid: string;

  Code: string;

  ItemSource: string;

  Progress: number;

  Responsible: string;

  LastUpdated: Date;

  SpecificationStatus: string;

  SpecificationSubject: string;
}
