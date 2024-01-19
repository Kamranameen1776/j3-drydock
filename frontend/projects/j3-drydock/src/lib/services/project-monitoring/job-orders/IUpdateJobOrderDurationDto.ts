export interface IUpdateJobOrderDurationDto {
  SpecificationUid: string;

  SpecificationStartDate: Date;

  SpecificationEndDate: Date;

  Progress?: number;

  LastUpdated: Date;
}
