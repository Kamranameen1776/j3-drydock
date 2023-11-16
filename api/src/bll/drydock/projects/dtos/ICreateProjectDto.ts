import { IsDateString, IsNumber, IsOptional, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
    ProjectCode?: string;

    CreatedAtOffice?: number;

    ProjectStateId?: number;

    TaskManagerUid?: string;

    @IsNumber()
    VesselId: number;

    @IsUUID('4')
    ProjectTypeUid: string;

    @MinLength(1)
    @MaxLength(200)
    Subject: string;

    @IsUUID('4')
    ProjectManagerUid: string;

    @IsOptional()
    @IsDateString()
    StartDate: Date;

    @IsOptional()
    @IsDateString()
    EndDate: Date;
}
