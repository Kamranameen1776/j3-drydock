import { IsDateString, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateStatementsOfFactsDto {
    @MinLength(1)
    @MaxLength(350)
    Fact: string;

    @IsNotEmpty()
    @IsDateString()
    DateAndTime: Date;

    @IsUUID('4')
    @IsNotEmpty()
    ProjectUid: string;
}
