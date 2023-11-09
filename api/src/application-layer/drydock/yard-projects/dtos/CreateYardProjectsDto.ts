export class CreateYardProjectsDto {
    uid: string;
    projectUid: string;
    yardUids: [];
    lastExportedDate: Date;
    isSelected: boolean;
    activeStatus: boolean;
    createdBy: string;
    createdAt: Date;
}
