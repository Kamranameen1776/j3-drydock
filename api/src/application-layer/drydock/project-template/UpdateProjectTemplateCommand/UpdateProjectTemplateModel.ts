import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

// TODO: add more validation attributes

export class UpdateProjectTemplateModel {
    @IsNotEmpty()
    @IsUUID()
    public ProjectTemplateUid: string;

    @IsNotEmpty()
    public Subject: string;

    public Description: string;

    @IsOptional()
    @IsNumber({}, { each: true })
    public VesselTypeId: number[] | null;

    @IsIn([true, false, 0, 1])
    public VesselTypeSpecific: boolean;

    @IsNotEmpty()
    @IsUUID()
    public ProjectTypeUid: string;

    @IsUUID(4, { each: true })
    public StandardJobs: string[];

    @IsNotEmpty()
    public LastUpdated: Date;

    @IsNotEmpty()
    @IsUUID()
    public UpdatedBy: string;
}
