import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteDailyReportsDto {
    @IsUUID()
    @IsNotEmpty()
    uid: string;
}
