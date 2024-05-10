import { ITMDetails } from 'j3-task-manager-ng';
import { eRfqFields } from '../enums/rfq.enum';

export interface YardLink {
  [eRfqFields.Yard]: string;
  [eRfqFields.Location]: string;
  [eRfqFields.Uid]: string;
  [eRfqFields.YardUid]: string;
  [eRfqFields.ExportedDate]: string;
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
  ShipYardId?: string;
  Subject: string;
  StartDate: string | Date;
  EndDate: string | Date;
  TaskManagerUid: string;
  ProjectTypeCode: string;
  VesselId: number;
}

export interface ProjectDetailsFull extends ProjectDetails, ITMDetails {}

export interface DailyReportCreate {
  ProjectUid: string;
  ReportName: string;
  ReportDate: string;
  Body: string;
}

export interface DailyReportUpdate {
  DailyReportUid: string;
  ProjectUid: string;
  ReportName: string;
  Body: string;
}
