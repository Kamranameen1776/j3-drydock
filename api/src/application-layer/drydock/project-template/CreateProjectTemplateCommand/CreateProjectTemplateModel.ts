import { IsNotEmpty, IsUUID } from 'class-validator';

// TODO: add more validation attributes

export class CreateProjectTemplateModel {
    @IsUUID()
    public ProjectTemplateUid?: string;

    @IsNotEmpty()
    public Subject: string;

    public Description: string;

    public VesselTypeUid: number[] | null;

    @IsNotEmpty()
    @IsUUID()
    public ProjectTypeUid: string;

    // TODO: validate it is an array of UUIDs
    public StandardJobs: string[];

    @IsNotEmpty()
    public CreatedAt: Date;

    @IsNotEmpty()
    public CreatedBy: string;
}
