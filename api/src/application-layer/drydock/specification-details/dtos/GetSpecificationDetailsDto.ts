import { InspectionsResultDto } from './InspectionsResultDto';

export class GetSpecificationDetailsDto {
    uid: string;
    Subject: string;
    SpecificationCode: string;
    Status: string;
    FunctionUid: string;
    AccountCode: string;
    ItemSourceUid: string;
    ItemSourceText: string;
    ItemNumber: string;
    DoneByUid: string;
    DoneByDisplayName: string;
    EquipmentDescription: string;
    Description: string;
    PriorityUid: string;
    PriorityName: string;
    VesselName: string;
    VesselUid: string;
    ProjectManager: string;
    ProjectManagerUid: string;
    Inspections: Array<InspectionsResultDto>;
    StartDate: Date;
    EndDate: Date;
    Completion: number;
    Duration: number;
}
