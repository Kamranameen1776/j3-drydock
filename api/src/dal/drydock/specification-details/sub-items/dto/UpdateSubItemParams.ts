import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { GetSubItemParams } from './GetSubItemParams';
import { SubItemEditableProps } from './SubItemEditableProps';

export class UpdateRelationsParams {
    @IsUUID('4', { each: true })
    linkedUids: string[];

    @IsUUID('4', { each: true })
    unlinkedUids: string[];
}

export class UpdateSubItemParams extends GetSubItemParams {
    @IsString()
    @IsNotEmpty()
    readonly updatedBy: string;

    @Type(() => SubItemEditableProps)
    @ValidateNested()
    readonly props: SubItemEditableProps;

    @IsOptional()
    @Type(() => UpdateRelationsParams)
    @ValidateNested()
    pmsJobs?: UpdateRelationsParams;

    @IsOptional()
    @Type(() => UpdateRelationsParams)
    @ValidateNested()
    findings?: UpdateRelationsParams;
}
