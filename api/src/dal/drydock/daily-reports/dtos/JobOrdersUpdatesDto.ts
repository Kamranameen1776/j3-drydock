export class JobOrdersUpdatesDto {
    uid?: string;
    name: string;
    remark: string;
    specificationUid: string;
    specificationCode: string;
    status: string;
    specificationSubject: string;
    updatedBy: string;
    progress: number;
    lastUpdated: Date;
}
