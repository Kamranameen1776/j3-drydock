export interface IJobOrderDto {
  IJobOrderUid: string;

  Code: string;

  Subject: string;

  ItemSource: string;

  Status: string;

  Progress: number;

  Responsible: string;

  LastUpdated: Date;
}
