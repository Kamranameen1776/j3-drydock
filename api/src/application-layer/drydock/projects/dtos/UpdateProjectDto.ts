import { IsDateString, IsUUID, MaxLength } from 'class-validator';

export class UpdateProjectDto {
    @IsUUID()
    public ProjectUid: string;

    @MaxLength(200)
    public Subject: string;

    public ProjectManagerUid: string;

    public StartDate: Date;

    public EndDate: Date;

    public ShipYardId: string;

    @IsDateString()
    public LastUpdated: Date;

    public UpdatedBy: string;
}
