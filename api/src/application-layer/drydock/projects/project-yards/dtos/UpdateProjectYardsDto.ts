import { IsBoolean, IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateProjectYardsDto {
    @IsNotEmpty()
    @IsUUID()
    uid: string;

    @IsDateString()
    lastExportedDate: Date;

    @IsBoolean()
    isSelected: boolean;
}
