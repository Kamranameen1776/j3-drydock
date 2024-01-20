import { IsArray, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateSpecificationDetailsDto {
    @IsUUID()
    uid: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    @MaxLength(350)
    Subject?: string;

    @MaxLength(350)
    @IsOptional()
    AccountCode?: string;

    @IsUUID()
    @IsOptional()
    DoneByUid?: string;

    @MinLength(1)
    @IsOptional()
    Description?: string;

    @IsUUID()
    @IsOptional()
    PriorityUid?: string;

    @IsArray()
    @IsNumber({}, { each: true })
    @IsOptional()
    Inspections?: Array<number>;
}
