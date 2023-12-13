import { IsDateString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class DeleteDailyReportsDto {
    @IsNotEmpty()
    uid: string;

    @MinLength(1)
    @MaxLength(50)
    deletedBy: string;

    @IsDateString()
    deletedAt: Date;
}
