export interface IYardProjectsResultDto {
    uid: string;
    yardUid: string;
    projectUid: string;
    lastExportedDate: Date;
    isSelected: boolean;
    activeStatus: boolean;
    createdByUid: string;
    createdAt: Date;
}
