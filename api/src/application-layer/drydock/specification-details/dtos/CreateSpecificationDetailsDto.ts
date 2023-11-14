import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateSpecificationDetailsDto {
    @IsUUID()
    ProjectUid: string;

    @IsUUID()
    FunctionUid: string;

    @MinLength(1)
    @MaxLength(100)
    Subject: string;

    @IsUUID()
    ItemSourceUid: string;

    @MinLength(1)
    @MaxLength(1000)
    Description: string;

    @IsArray()
    @ArrayMinSize(0)
    @IsNumber({}, { each: true })
    Inspections: Array<number>;

    @IsUUID()
    @IsOptional()
    DoneByUid: string;
}
