export interface ProjectCreate {
  FleetId: number;
  VesselId: number;
  ProjectTypeId: number;
  Subject: string;
  ProjectManagerUid: string;
  StartDate: Date
  EndDate: Date
}

export interface Project extends ProjectCreate {
  uid: string;
}
