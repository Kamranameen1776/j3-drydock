import { IsDateString, IsNotEmpty, IsUUID, MaxLength, MinLength } from 'class-validator';

export class UpdateDailyReportsDto {
    @IsNotEmpty()
    @IsUUID()
    uid: string;

    @MinLength(1)
    @MaxLength(200)
    reportName: string;

    @MinLength(1)
    @MaxLength(5000)
    description: string;

    @MinLength(1)
    @MaxLength(50)
    updatedBy: string;

    @IsDateString()
    updatedAt: Date;
}
