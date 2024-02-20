import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

// TODO: add more validation attributes

export class UpdateProjectTemplateModel {
    @IsNotEmpty()
    @IsUUID()
    public ProjectTemplateUid: string;

    @IsNotEmpty()
    public Subject: string;

    public Description: string;

    @IsNumber({}, { each: true })
    public VesselTypeUid: number[] | null;

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
