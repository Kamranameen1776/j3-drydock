import { SpecificationSubItem } from '../../../../models/interfaces/specification-sub-item';

export interface IJobOrderFormResultDto {
  SpecificationUid: string;
  Progress: number;
  Remarks: string;
  Subject: string;
  Status: string;
  SpecificationStartDate: Date;
  SpecificationEndDate: Date;
  UpdatesChanges: SpecificationSubItem[];
}
