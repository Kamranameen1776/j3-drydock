export interface JobOrdersUpdatesDto {
  name: string;
  remark: string;
  specificationUid: string;
  specificationCode: string;
  lastUpdated: Date;
  specificationSubject: string;
  updatedBy?: string;
  status: string;
  progress: string;
}
