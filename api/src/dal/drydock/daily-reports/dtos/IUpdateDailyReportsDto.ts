export interface IUpdateDailyReportsDto {
    uid: string;
    lastExportedDate?: Date;
    isSelected: boolean;
    updatedBy: string;
    updatedAt: Date;
}
