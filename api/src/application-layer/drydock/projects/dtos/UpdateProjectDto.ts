import { Type } from 'class-transformer';
import { IsDate, IsUUID, MaxLength } from 'class-validator';

export class UpdateProjectDto {
    @IsUUID()
    public ProjectUid: string;

    @MaxLength(200)
    public Subject: string;

    public ProjectManagerUid: string;

    @Type(() => Date)
    @IsDate()
    public StartDate: Date;

    @Type(() => Date)
    @IsDate()
    public EndDate: Date;

    public ShipYardId: string;

    @Type(() => Date)
    @IsDate()
    public LastUpdated: Date;

    public UpdatedBy: string;
}
