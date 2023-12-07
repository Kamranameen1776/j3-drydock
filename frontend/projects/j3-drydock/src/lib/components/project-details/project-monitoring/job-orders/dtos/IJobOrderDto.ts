export interface IJobOrderDto {
  JobOrderUid: string;

  Code: string;

  Subject: string;

  ItemSource: string;

  Status: string;

  Progress: number;

  Responsible: string;

  LastUpdated: Date;
}
