import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsUUID, MaxLength } from 'class-validator';

export const startDateInvalidMessage = 'Invalid project start date';

export const endDateInvalidMessage = 'Invalid project end date';

export class UpdateProjectDto {
    @IsUUID()
    public ProjectUid: string;

    @MaxLength(200)
    public Subject: string;

    public ProjectManagerUid: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({
        message: startDateInvalidMessage,
    })
    public StartDate?: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate({
        message: endDateInvalidMessage,
    })
    public EndDate?: Date;

    public ShipYardId: string;

    @Type(() => Date)
    @IsDate()
    public LastUpdated: Date;

    public UpdatedBy: string;
}
