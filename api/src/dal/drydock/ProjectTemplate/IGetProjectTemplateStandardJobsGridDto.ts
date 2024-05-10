import { ODataResult } from '../../../shared/interfaces';

export interface IGetProjectTemplateStandardJobsGridResult {
    ProjectTemplateUid: string;
    StandardJobUid: string;

    ItemNumber: string;

    Subject: string;

    VesselType: string;
    VesselTypeId: string;

    InspectionSurvey: string;
    InspectionSurveyId: string;

    DoneBy: string;
    DoneByUid: string;

    MaterialSuppliedBy: string;
    MaterialSuppliedByUid: string;
}

export type IGetProjectTemplateStandardJobsGridQueryResult = ODataResult<IGetProjectTemplateStandardJobsGridResult>;

export interface IGetProjectTemplateStandardJobsGridDto {
    ProjectTemplateUid: string;
    StandardJobUid: string;

    ItemNumber: string;

    Subject: string;

    VesselType: string;
    VesselTypeId: number[];

    InspectionSurvey: string;
    InspectionSurveyId: number[];

    DoneBy: string;
    DoneByUid: string;

    MaterialSuppliedBy: string;
    MaterialSuppliedByUid: string;
}

export type IGetProjectTemplateStandardJobsGridDtoResult = ODataResult<IGetProjectTemplateStandardJobsGridDto>;
