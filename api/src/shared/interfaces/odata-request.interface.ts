import { IsNumberString, IsOptional, IsString } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/naming-convention
export class ODataRequest {
    @IsOptional()
    @IsString()
    readonly $filter: string;

    @IsOptional()
    @IsString()
    readonly $select: string;

    @IsOptional()
    @IsNumberString()
    readonly $skip: string;

    @IsOptional()
    @IsNumberString()
    readonly $top: string;

    @IsOptional()
    @IsString()
    readonly $orderby: string;

    @IsOptional()
    @IsString()
    readonly $expand: string;

    @IsOptional()
    @IsString()
    readonly $count: string;

    @IsOptional()
    @IsString()
    readonly $distinct: string;
}
