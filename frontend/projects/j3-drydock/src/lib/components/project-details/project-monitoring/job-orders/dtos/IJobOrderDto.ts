export interface IJobOrderDto {
  SpecificationUid: string;

  Code: string;

  Progress: number;

  ItemSource: string;

  DoneBy: string;

  LastUpdated: Date;

  SpecificationStatus: string;

  SpecificationSubject: string;
}
