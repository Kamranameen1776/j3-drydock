import { ODataResult } from "../../../shared/interfaces/odata-result.interface";

export interface GetStandardJobsResult {
    uid: string;
    subject: string;
    code: string;
    category: string;
    dueDate: string;
    vesselTypeSpecific: boolean;
    description: string;
    activeStatus: boolean;
    vesselTypeId: number;
    vesselType: string;
}

export interface GetStandardJobsResultDto extends ODataResult<GetStandardJobsResult> {}
