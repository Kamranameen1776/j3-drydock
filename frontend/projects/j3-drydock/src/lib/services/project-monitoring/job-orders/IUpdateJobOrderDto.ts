export interface IUpdateJobOrderDto {
  SpecificationUid: string;

  SpecificationStartDate: string;

  SpecificationEndDate: string;

  Progress: number;

  Status: string;

  Subject: string;

  LastUpdated: Date;
}
