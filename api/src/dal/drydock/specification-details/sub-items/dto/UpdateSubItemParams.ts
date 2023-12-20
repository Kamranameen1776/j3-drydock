import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { GetSubItemParams } from './GetSubItemParams';
import { SubItemEditableProps } from './SubItemEditableProps';

/** @private */
class SubItemEditablePropsPartial implements Partial<SubItemEditableProps> {
    @IsOptional()
    readonly subject: string;

    @IsOptional()
    readonly unitUid?: string;

    @IsOptional()
    readonly quantity?: number;

    @IsOptional()
    readonly unitPrice?: number;

    @IsOptional()
    readonly discount?: number;

    @IsOptional()
    readonly description?: string;
}

export class UpdatePmsJobsParams {
    @IsUUID('4', { each: true })
    linkedUids: string[];

    @IsUUID('4', { each: true })
    unlinkedUids: string[];
}

export class UpdateSubItemParams extends GetSubItemParams {
    @IsString()
    @IsNotEmpty()
    readonly updatedBy: string;

    @Type(() => SubItemEditablePropsPartial)
    @ValidateNested()
    readonly props: SubItemEditablePropsPartial;

    @Type(() => UpdatePmsJobsParams)
    @ValidateNested()
    pmsJobs: UpdatePmsJobsParams;
}
