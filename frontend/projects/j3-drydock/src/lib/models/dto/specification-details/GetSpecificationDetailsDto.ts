import { Vessel } from './VesselDto';

export interface GetSpecificationDetailsDto {
  uid: string;
  tmTask: string;
  FunctionUid: string;
  componentUid: string;
  accountCode: string;
  itemSourceUid: string;
  itemNumber: string;
  doneByUid: string;
  itemCategoryUid: string;
  inspectionUid: string;
  equipmentDescription: string;
  priorityUid: string;
  Description: string;
  startDate: Date;
  estimatedDays: number;
  bufferTime: number;
  treatment: string;
  onboardLocationUid: string;
  access: string;
  materialSuppliedByUid: string;
  testCriteria: string;
  ppe: string;
  safetyInstruction: string;
  activeStatus: boolean;
  createdByUid: string;
  createdAt: Date;
  SpecificationCode: string;
  ProjectManagerUid?: string;
  ProjectManager?: string;
  title?: string;
  destination?: Vessel;
  VesselName?: string;
  Status?: string;
  Subject?: string;
}
