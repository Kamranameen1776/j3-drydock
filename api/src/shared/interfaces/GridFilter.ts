import { IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class GridFilter {
    @IsDefined()
    @IsString()
    type: string;

    @IsDefined()
    @IsString()
    odataKey: string;

    @IsDefined()
    selectedValues: unknown;

    @IsOptional()
    @IsBoolean()
    includeFilter?: boolean;

    @IsOptional()
    dateMethod?: string;
}
