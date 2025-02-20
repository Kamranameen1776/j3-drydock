export interface IGetProjectTemplateResponse {
    ProjectTemplateUid: string;

    Subject: string;

    Description: string | null;

    VesselTypeID: number[] | null;
    VesselTypeSpecific: boolean;

    ProjectTypeUid: string;
}
