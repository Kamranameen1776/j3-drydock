import { JobOrderStatus } from './JobOrderStatus';

export interface IJobOrderDto {
  SpecificationUid: string;

  JobOrderUid: string;

  Code: string;

  Subject: string;

  ItemSource: string;

  Status: string;

  Progress: number;

  Responsible: string;

  LastUpdated: Date;

  SpecificationStatus: JobOrderStatus;

  SpecificationStartDate: Date;

  SpecificationEndDate: Date;

  SpecificationSubject: string;
}
