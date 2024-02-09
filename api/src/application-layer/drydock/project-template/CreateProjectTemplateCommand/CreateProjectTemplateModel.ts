import { IsNotEmpty, IsUUID } from 'class-validator';

// TODO: add more validation attributes

export class CreateProjectTemplateModel {
    @IsNotEmpty()
    public Subject: string;

    public Description: string;

    public VesselTypeUid: string | null;

    @IsNotEmpty()
    @IsUUID()
    public ProjectTypeUid: string;

    public StandardJobs: string[];
}
