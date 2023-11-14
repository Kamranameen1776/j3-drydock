export interface IUpdateSpecificationDetailsDto {
    uid: string;

    Subject?: string;

    AccountCode?: string;

    DoneByUid?: string;

    Description?: string;

    PriorityUid?: string;

    Inspections?: Array<number>;
}
