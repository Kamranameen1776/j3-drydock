import { InspectionsDto } from '../dto/specification-details/IInspectionsResultDto';
import { ITMDetails } from 'j3-task-manager-ng';
import { eSpecificationWorkflowStatusAction } from '../enums/specification-details.enum';

export interface SpecificationDetails {
  AccountCode: string;
  Completion?: number;
  Description: string;
  DoneByDisplayName: string;
  DoneByUid: string;
  Duration?: number;
  EquipmentDescription: string;
  EndDate?: Date | string;
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
  StatusId: eSpecificationWorkflowStatusAction;
  StatusName: string;
  StartDate?: Date | string;
  Subject: string;
  VesselName: string;
  VesselUid: string;
  uid: string;
  TaskManagerUid: string;
  SpecificationTypeCode: string;
  SpecificationTypeName: string;
  VesselId: number;
  ProjectUid: string;
  ProjectStatusId?: string;
}
export interface SpecificationDetailsFull extends SpecificationDetails, ITMDetails {}
