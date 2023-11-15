export interface ICreateSpecificationDetailsDto {
    uid?: string;

    ProjectUid: string;

    FunctionUid: string;

    Subject: string;

    ItemSourceUid: string;

    Description: string;

    DoneByUid: string;

    CreatedAt?: Date;

    ActiveStatus?: boolean;
}
