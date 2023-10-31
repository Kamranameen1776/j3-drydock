import { IsDateString, IsNumber, IsUUID, MaxLength, MinLength } from 'class-validator';

export class ICreateProjectDto {
    ProjectCode?: string;

    CreatedAtOffice?: number;

    ProjectStateId?: number;

    TaskManagerUid?: string;

    @IsNumber()
    VesselId: number;

    @IsUUID('4')
    ProjectTypeUid: string;

    @MinLength(1)
    @MaxLength(250)
    Subject: string;

    @IsUUID('4')
    ProjectManagerUid: string;

    @IsDateString()
    StartDate: Date;

    @IsDateString()
    EndDate: Date;
}
