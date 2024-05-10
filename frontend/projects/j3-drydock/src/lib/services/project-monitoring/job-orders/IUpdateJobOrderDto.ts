import { SpecificationSubItem } from '../../../models/interfaces/specification-sub-item';

export interface IUpdateJobOrderDto {
  SpecificationUid: string;

  SpecificationStartDate: Date;

  SpecificationEndDate: Date;

  Progress: number;

  Status: string;

  Subject: string;

  LastUpdated: Date;

  Remarks: string;

  UpdatesChanges?: SpecificationSubItem[];

  uid?: string;
}
