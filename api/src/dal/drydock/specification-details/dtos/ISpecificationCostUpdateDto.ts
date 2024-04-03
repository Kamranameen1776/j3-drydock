import { IsUUID } from 'class-validator';

import { ODataBodyDto } from '../../../../shared/dto';
import { TaskManagerStatus } from '../../../../shared/enum/task-manager-status.enum';
import { HtmlCell } from '../../../../shared/interfaces';
import { HtmlRow } from '../../../../shared/interfaces/html-row.interface';

export interface SpecificationCostUpdateQueryResult {
    uid: string;
    subject: string;
    status: string;
    statusId: TaskManagerStatus;
    code: string;
    itemNumber: string;
    description: string;
    subItemUid: string;
    subItemSubject: string;
    subItemDescription: string;
    subItemCost: number;
    subItemUtilized: number;
    estimatedCost: number;
}

export type SpecificationCostUpdateDto = SpecificationCostUpdate | SpecificationSubItemCostUpdate;

export interface SpecificationCostUpdate extends HtmlRow {
    specificationUid: string;
    subject: string;
    status: string;
    estimatedCost: string;
    code: string;
    variance: HtmlCell;
    utilizedCost?: string;
}

export interface SpecificationSubItemCostUpdate extends HtmlRow {
    specificationUid?: string;
    subItemUid: string;
    subItemSubject: string;
    estimatedCost: string;
    utilizedCost: string;
    variance: HtmlCell;
    editable: boolean;
}

export class SpecificationCostUpdateRequestDto extends ODataBodyDto {
    @IsUUID('4')
    projectUid: string;
}
