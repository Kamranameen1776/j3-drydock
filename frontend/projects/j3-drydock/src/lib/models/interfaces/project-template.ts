// TODO remove optionals once api is done
export interface ProjectTemplate {
  ProjectTemplateUid?: string;
  TemplateCode: string;
  Subject: string;
  ProjectType: string;
  VesselType: string;
  NoOfSpecItems: number;
  LastUpdated: string;

  VesselTypeId: number[];
  ProjectTypeCode?: string;
  TemplateCodeRaw?: number;
  Description?: string;
  ProjectTypeUid: string;
  VesselTypeSpecific: number;
}
