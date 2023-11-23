import { InspectionsDto } from './IInspectionsResultDto';
export interface GetSpecificationDetailsDto {
  AccountCode: string;
  Description: string;
  DoneByDisplayName: string;
  DoneByUid: string;
  EquipmentDescription: string;
  FunctionUid: string;
  Function: string;
  Inspections: InspectionsDto[];
  ItemNumber: string;
  ItemSourceText: string;
  ItemSourceUid: string;
  PriorityName: string;
  PriorityUid: string;
  ProjectManager: string;
  ProjectManagerUid: string;
  SpecificationCode: string;
  Status: string;
  Subject: string;
  VesselName: string;
  VesselUid: string;
  uid: string;
}
