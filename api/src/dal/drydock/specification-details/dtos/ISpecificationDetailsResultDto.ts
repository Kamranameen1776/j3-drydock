import { InspectionsResultDto } from './IInspectionsResultDto';

export class SpecificationDetailsResultDto {
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
    VesselType: string;
    VesselId: number;
    ProjectManager: string;
    ProjectManagerUid: string;
    Inspections: Array<InspectionsResultDto>;
}
