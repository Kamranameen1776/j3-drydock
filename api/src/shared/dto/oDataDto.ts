/* eslint-disable @typescript-eslint/naming-convention */
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { ODataRequest } from '../interfaces';
import { GridFilter } from '../interfaces/GridFilter';

export class ODataDto implements ODataRequest {
    @IsOptional()
    @IsString()
    $filter: string;

    @IsOptional()
    @IsString()
    $select: string;

    @IsOptional()
    @IsString()
    $skip: string;

    @IsOptional()
    @IsString()
    $top: string;

    @IsOptional()
    @IsString()
    $orderby: string;

    @IsOptional()
    @IsString()
    $expand: string;

    @IsOptional()
    @IsString()
    $count: string;

    @IsOptional()
    @IsString()
    $distinct: string;
}

export class ODataBodyDto {
    @ValidateNested()
    odata: ODataDto;
}

export class ODataBodyDtoWithFilters {
    @ValidateNested()
    odata: ODataRequest;
    @ValidateNested()
    gridFilters: GridFilter[];
}
