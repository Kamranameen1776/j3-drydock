export class JobOrdersUpdatesDto {
    uid?: string;
    subject: string;
    remark: string;
    specificationUid: string;
    specificationCode: string;
    status: string;
    specificationSubject: string;
    updatedBy: string;
    progress: number;
    lastUpdated: Date;
}
