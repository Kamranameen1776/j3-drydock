export class CreateYardProjectsDto {
    uid: string;
    projectUid: string;
    yardUid: [];
    lastExportedDate: Date;
    isSelected: boolean;
    activeStatus: boolean;
    createdBy: string;
    createdAt: Date;
}
