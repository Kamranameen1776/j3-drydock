export interface ProjectCreate {
  FleetId: number;
  VesselId: number;
  ProjectTypeId: number;
  Subject: string;
  ProjectManagerUid: string;
  StartDate: string;
  EndDate: string;
}

export interface Project {
  uid: string;
  FleetId: number;
  VesselId: number;
  ProjectTypeId: number;
  Subject: string;
  ProjectManagerUid: string;
  StartDate: string;
  EndDate: string;
}

export interface ProjectEdit {
  ProjectUid: string;
  Subject: string;
  ProjectManagerUid: string;
  StartDate: Date;
  EndDate: Date;
  LastUpdated: Date;
  ShipYardId: string;
}
