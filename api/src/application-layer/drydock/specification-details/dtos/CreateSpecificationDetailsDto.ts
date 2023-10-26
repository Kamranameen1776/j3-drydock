import { BaseSpecificationDetailsDto } from './BaseSpecificationDetailsDto';

export class CreateSpecificationDetailsDto extends BaseSpecificationDetailsDto {
    public uid: string;
    public tmTask: string;
    public functionUid: string;
    public componentUid: string;
    public accountCode: string;
    public itemSourceUid: string;
    public itemNumber: string;
    public doneByUid: string;
    public itemCategoryUid: string;
    public inspectionUid: string;
    public equipmentDescription: string;
    public priorityUid: string;
    public description: string;
    public startDate: Date;
    public estimatedDays: number;
    public bufferTime: number;
    public treatment: string;
    public onboardLocationUid: string;
    public access: string;
    public materialSuppliedByUid: string;
    public testCriteria: string;
    public ppe: string;
    public safetyInstruction: string;
    public activeStatus: boolean;
    public createdByUid: string;
    public createdAt: Date;
}
