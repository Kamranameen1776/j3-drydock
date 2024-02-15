export interface IGetProjectTemplateGridDto {
    ProjectTemplateUid: string;

    TemplateCode: string;

    Subject: string;

    ProjectType: string;
    ProjectTypeUid: string;
    ProjectTypeCode: string;

    VesselType: string;
    VesselTypeId: string;

    NoOfSpecItems: number;

    LastUpdated: Date;
}
