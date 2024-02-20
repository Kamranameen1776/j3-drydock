import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

// TODO: add more validation attributes

export class CreateProjectTemplateModel {
    @IsUUID()
    @IsOptional()
    public ProjectTemplateUid?: string;

    @IsNotEmpty()
    public Subject: string;

    public Description: string;

    @IsNumber({}, { each: true })
    public VesselTypeId: number[] | null;

    @IsNotEmpty()
    @IsUUID()
    public ProjectTypeUid: string;

    @IsUUID(4, { each: true })
    public StandardJobs: string[];

    @IsNotEmpty()
    public CreatedAt: Date;

    @IsNotEmpty()
    @IsUUID()
    public CreatedBy: string;
}
