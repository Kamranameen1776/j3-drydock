import { JobOrderStatus } from './JobOrderStatus';

export interface IJobOrderDto {
  IJobOrderUid: string;

  Code: string;

  Subject: string;

  ItemSource: string;

  Status: JobOrderStatus;

  Progress: number;

  Responsible: string;

  LastUpdated: Date;

  Updates: number;
}
