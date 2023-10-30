import { ODataResult } from '../../../../shared/interfaces';
import { HtmlCell } from '../../../../shared/interfaces/html-cell.interface';

export interface GetStandardJobsQueryData {
    uid: string;
    subject: string;
    function: string;
    code: string;
    scope: string;
    category?: string;
    categoryUid: string;
    doneBy?: string;
    doneByUid: string;
    inspectionId: number;
    inspection: string;
    materialSuppliedBy?: string;
    materialSuppliedByUid: string;
    vesselTypeSpecific: boolean;
    description: string;
    activeStatus: boolean;
    vesselTypeId: number;
    vesselType: string;
}

export interface GetStandardJobsResult extends Omit<GetStandardJobsQueryData, 'subject' | 'inspectionId' | 'vesselTypeId'> {
    subject: HtmlCell;
    inspectionId: number[];
    vesselTypeId: number[];
}

export type GetStandardJobsQueryResult = ODataResult<GetStandardJobsQueryData>;

export type GetStandardJobsResultDto = ODataResult<GetStandardJobsResult>;
