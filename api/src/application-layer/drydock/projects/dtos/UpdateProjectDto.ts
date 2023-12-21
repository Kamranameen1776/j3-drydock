import { IsDateString, IsUUID, MaxLength } from 'class-validator';

export class UpdateProjectDto {
    @IsUUID()
    public ProjectUid: string;

    @MaxLength(250)
    public Subject: string;

    public ProjectManagerUid: string;

    @IsDateString()
    public StartDate: Date;

    @IsDateString()
    public EndDate: Date;

    public ShipYardId: string;

    @IsDateString()
    public LastUpdated: Date;

    public UpdatedBy: string;
}
