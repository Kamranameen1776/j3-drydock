import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateProjectTemplateModel {
    @IsUUID()
    @IsOptional()
    public ProjectTemplateUid?: string;

    @IsNotEmpty()
    public Subject: string;

    public Description: string;

    @IsOptional()
    @IsNumber({}, { each: true })
    public VesselTypeId: number[];

    @IsIn([true, false, 0, 1])
    public VesselTypeSpecific: boolean;

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
