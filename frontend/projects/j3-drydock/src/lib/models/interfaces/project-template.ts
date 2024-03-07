// TODO remove optionals once api is done
export interface ProjectTemplate {
  ProjectTemplateUid?: string;
  TemplateCode: string;
  Subject: string;
  ProjectType: string;
  VesselType: string;
  NoOfSpecItems: number;
  LastUpdated: string;

  Description?: string;
  VesselTypeID?: string;
  ProjectTypeUid?: string;
  vesselTypeSpecific?: number;
}
