import { BaseSpecificationDetailsDto } from './BaseSpecificationDetailsDto';

export interface SpecificationDetailsDto extends BaseSpecificationDetailsDto {
    uid: string;
    tmTask: string;
    functionUid: string;
    componentUid: string;
    accountCode: string;
    itemSourceUid: string;
    itemNumber: string;
    doneByUid: string;
    itemCategoryUid: string;
    inspectionUid: string;
    equipmentDescription: string;
    priorityUid: string;
    description: string;
    startDate: Date;
    estimatedDays: number;
    bufferTime: number;
    treatment: string;
    onboardLocationUid: string;
    access: string;
    materialSuppliedByUid: string;
    testCriteria: string;
    ppe: string;
    safetyInstruction: string;
    activeStatus: boolean;
    createdByUid: string;
    createdAt: Date;
}
