export interface JobOrdersUpdatesDto {
  subject: string;
  remark: string;
  specificationUid: string;
  specificationCode: string;
  status: string;
  progress: number;
  lastUpdated: Date;
  specificationSubject: string;
  updatedBy: string;
}
