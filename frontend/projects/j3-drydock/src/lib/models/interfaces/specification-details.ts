import { InspectionsDto } from '../dto/specification-details/IInspectionsResultDto';
import { ITMDetails } from 'j3-task-manager-ng';

export interface SpecificationDetails {
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
  StatusId: string;
  StatusName: string;
  Subject: string;
  VesselName: string;
  VesselUid: string;
  uid: string;
  TaskManagerUid: string;
  SpecificationTypeCode: string;
  SpecificationTypeName: string;
  VesselId: number;
  ProjectUid: string;
}
export interface SpecificationDetailsFull extends SpecificationDetails, ITMDetails {}
