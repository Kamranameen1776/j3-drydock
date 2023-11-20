import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class UpdateProjectYardsDto {
    @IsNotEmpty()
    @IsUUID()
    uid: string;

    @IsOptional()
    @IsDateString()
    lastExportedDate?: Date;

    @IsBoolean()
    isSelected: boolean;
}
