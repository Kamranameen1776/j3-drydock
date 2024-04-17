import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

import { QueryStrings } from '../../../../shared/enum/queryStrings.enum';
import { GetStandardJobsQueryData } from './GetStandardJobsResultDto';

export interface CreateStandardJobsRequestDto
    extends Omit<
        GetStandardJobsQueryData,
        | 'vesselType'
        | 'vesselTypeId'
        | 'activeStatus'
        | 'uid'
        | 'category'
        | 'materialSuppliedBy'
        | 'doneBy'
        | 'inspectionId'
    > {
    uid?: string;
    vesselTypeId: number[];
    inspectionId: number[];

    UserId: string;
}

export class CreateStandardJobsRequestDto implements CreateStandardJobsRequestDto {
    @IsOptional()
    @IsUUID('4')
    uid?: string;

    @IsOptional()
    @IsString()
    subject: string;

    @IsOptional()
    @IsString()
    function: string;

    @IsOptional()
    @IsUUID('4')
    functionUid: string;

    @IsOptional()
    @IsString()
    code: string;

    @IsOptional()
    @IsString()
    number: number;

    @IsOptional()
    @IsString()
    scope: string;

    @IsOptional()
    @IsString()
    category: string;

    @IsOptional()
    @IsUUID('4')
    categoryUid: string;

    @IsOptional()
    @IsString()
    doneBy: string;

    @IsOptional()
    @IsUUID('4')
    doneByUid: string;

    @IsOptional()
    @IsString()
    inspection: string;

    @IsOptional()
    @IsNumber({}, { each: true })
    inspectionId: number[];

    @IsOptional()
    @IsString()
    materialSuppliedBy: string;

    @IsOptional()
    @IsUUID('4')
    materialSuppliedByUid: string;

    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    vesselTypeSpecific: boolean;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    activeStatus: boolean;

    @IsOptional()
    @IsNumber({}, { each: true })
    vesselTypeId: number[];

    @IsOptional()
    @IsNumber()
    estimatedDuration: number;

    @IsOptional()
    @IsNumber()
    estimatedBudget: number;

    @IsOptional()
    @IsNumber()
    bufferTime: number;

    @IsOptional()
    @IsUUID('4')
    glAccountUid: string;

    @IsOptional()
    @IsString()
    @IsIn([QueryStrings.Yes, QueryStrings.No])
    jobRequired: string;

    @IsOptional()
    @IsUUID('4')
    jobExecutionUid: string;

    @IsString()
    UserId: string;
}
