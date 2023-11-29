import { InspectionsDto } from '../dto/specification-details/IInspectionsResultDto';
import { eFunction } from '../enums/function.enum';
import { eModule } from '../enums/module.enum';

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
}

export interface SpecificationDetailsTopHeaderDetails extends SpecificationDetails {
  taskManager: { status: { code: string } };
  officeId: number;
  vessel: { uid: string };
  _id: string;
  functionCode: eFunction;
  moduleCode: eModule;
}
