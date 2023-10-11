import { ODataResult } from '../../../shared/interfaces';
import { HtmlCell } from '../../../shared/interfaces/html-cell.interface';

export interface GetStandardJobsQueryData {
    uid: string;
    subject: string;
    function: string;
    code: string;
    category: string;
    doneBy: string;
    inspection: string;
    materialSuppliedBy: string;
    vesselTypeSpecific: boolean;
    description: string;
    activeStatus: boolean;
    vesselTypeId: number;
    vesselType: string;
}

export interface GetStandardJobsResult extends Omit<GetStandardJobsQueryData, 'subject'> {
    subject: HtmlCell | string;
}

export interface GetStandardJobsQueryResult extends ODataResult<GetStandardJobsQueryData> {}

export interface GetStandardJobsResultDto extends ODataResult<GetStandardJobsResult> {}
