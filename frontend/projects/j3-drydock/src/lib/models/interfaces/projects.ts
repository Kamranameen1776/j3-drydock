export interface ProjectCreate {
  FleetId: number;
  VesselId: number;
  ProjectTypeId: number;
  Subject: string;
  ProjectManagerUid: string;
  StartDate: string;
  EndDate: string;
}

export interface Project extends ProjectCreate {
  uid: string;
}

export interface ProjectEdit {
  uid: string;
  FleetId: number;
  VesselId: number;
  ProjectTypeId: number;
  Subject: string;
  ProjectManagerUid: string;
  StartDate: string;
  EndDate: string;
}

export interface Project extends ProjectEdit {
  uid: string;
}
