export interface IJobOrderDto {
  SpecificationUid: string;

  Code: string;

  Progress: number;

  ItemSource: string;

  Responsible: string;

  LastUpdated: Date;

  SpecificationStatus: string;

  SpecificationSubject: string;
}
