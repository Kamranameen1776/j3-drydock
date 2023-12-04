import { eFunction } from '../enums/function.enum';
import { eModule } from '../enums/module.enum';
import { eRfqFields } from '../enums/rfq.enum';

export interface YardLink {
  [eRfqFields.Yard]: string;
  [eRfqFields.Location]: string;
  [eRfqFields.Uid]: string;
  [eRfqFields.YardUid]: string;
  [eRfqFields.ExportedDate]: string;
  [eRfqFields.IsSelected]: boolean;
}

export interface YardToLink {
  [eRfqFields.Yard]: string;
  [eRfqFields.Location]: string;
  [eRfqFields.Uid]: string;

  isLinked?: boolean;
  isDisable?: boolean;
}

export interface ProjectDetails {
  ProjectId: string;
  ProjectCode: string;
  ProjectTypeName: string;
  ProjectManager: string;
  ProjectManagerUid: string;
  ShipYard: string;
  Specification: string;
  ProjectStatusName: string;
  ProjectStatusId: string;
  ProjectState: string;
  VesselName: string;
  VesselUid: string;
  VesselType: number;
  Subject: string;
  StartDate: string;
  EndDate: string;
  TaskManagerUid: string;
  ProjectTypeCode: string;
  VesselId: number;
}

export interface ProjectTopHeaderDetails extends ProjectDetails {
  taskManager: { status: { code: string } };
  officeId: number;
  vessel: { uid: string };
  _id: string;
  functionCode: eFunction;
  moduleCode: eModule;
}
