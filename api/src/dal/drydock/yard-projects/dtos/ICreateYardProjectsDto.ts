export interface ICreateYardProjectsDto {
    uid: string;
    projectUid: string;
    yardUid: [];
    lastExportedDate: Date;
    isSelected: boolean;
    activeStatus: boolean;
    createdBy: string;
    createdAt: Date;
}
