import { IsDateString, IsNotEmpty, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateStatementOfFactsDto {
    @IsNotEmpty()
    @IsUUID(4)
    StatementOfFactUid: string;

    @MinLength(1)
    @MaxLength(350)
    Fact: string;

    @IsDateString()
    DateTime: Date;
}
