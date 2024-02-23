import { ODataResult } from '../../../shared/interfaces';

export interface IGetProjectTemplateGridDto {
    ProjectTemplateUid: string;

    TemplateCode: string;
    TemplateCodeRaw: string;

    Subject: string;

    ProjectType: string;
    ProjectTypeUid: string;
    ProjectTypeCode: string;

    VesselType: string;
    VesselTypeId: number[];
    VesselTypeSpecific: boolean;

    NoOfSpecItems: number;

    LastUpdated: Date;
}

export interface IGetProjectTemplateGridResult {
    ProjectTemplateUid: string;

    TemplateCode: string;
    TemplateCodeRaw: string;

    Subject: string;

    ProjectType: string;
    ProjectTypeUid: string;
    ProjectTypeCode: string;

    VesselType: string;
    VesselTypeId: string;
    VesselTypeSpecific: boolean;

    NoOfSpecItems: number;

    LastUpdated: Date;
}

export type IGetProjectTemplateGridQueryResult = ODataResult<IGetProjectTemplateGridResult>;

export type IGetProjectTemplateGridDtoResult = ODataResult<IGetProjectTemplateGridDto>;
