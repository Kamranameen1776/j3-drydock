import { IsDateString, IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateStatementOfFactsDto {
    @IsNotEmpty()
    @IsUUID(4)
    uid: string;

    @IsOptional()
    @MinLength(1)
    @MaxLength(350)
    Fact?: string;

    @IsOptional()
    @IsDateString()
    DateAndTime?: Date;
}
