import { ODataResult } from '../../../../shared/interfaces';
import { HtmlCell } from '../../../../shared/interfaces/html-cell.interface';
import { GetStandardJobSubItemsResultDto } from './GetStandardJobSubItemsResultDto';

export interface GetStandardJobsQueryData {
    uid: string;
    subject: string;
    function: string;
    functionUid: string;
    code: string;
    scope: string;
    category?: string;
    categoryUid: string;
    doneBy?: string;
    doneByUid: string;
    inspectionId: string;
    inspection: string;
    materialSuppliedBy?: string;
    materialSuppliedByUid: string;
    vesselTypeSpecific: boolean;
    description: string;
    activeStatus: boolean;
    vesselTypeId: string;
    vesselType: string;
    subItemUid: string;
    subItemCode: string;
    subItemSubject: string;
    subItemDescription: string;
}

export interface GetStandardJobsResult extends Omit<GetStandardJobsQueryData, 'subject' | 'inspectionId' | 'vesselTypeId' | 'subItemUid' | 'subItemCode' | 'subItemSubject' | 'subItemDescription'> {
    subject: HtmlCell;
    inspectionId: (number | string)[];
    vesselTypeId: (number | string)[];
    subItems: GetStandardJobSubItemsResultDto[];
}

export type GetStandardJobsQueryResult = ODataResult<GetStandardJobsQueryData>;

export type GetStandardJobsResultDto = ODataResult<GetStandardJobsResult>;
