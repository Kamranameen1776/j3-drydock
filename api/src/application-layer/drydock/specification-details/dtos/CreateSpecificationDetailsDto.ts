import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateSpecificationDetailsDto {
    @IsUUID()
    ProjectUid: string;

    @IsUUID()
    FunctionUid: string;

    @IsString()
    @MinLength(1)
    @MaxLength(250)
    Function: string;

    @MinLength(1)
    @MaxLength(100)
    Subject: string;

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
