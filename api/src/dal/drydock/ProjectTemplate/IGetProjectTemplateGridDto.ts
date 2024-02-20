export interface IGetProjectTemplateGridDto {
    ProjectTemplateUid: string;

    TemplateCode: string;
    TemplateCodeRaw: string;

    Subject: string;

    ProjectType: string;
    ProjectTypeUid: string;
    ProjectTypeCode: string;

    VesselType: string;
    VesselTypeId: string;

    NoOfSpecItems: number;

    LastUpdated: Date;
}
