export interface GetRequisitionsResponseDto {
    uid: string;
    number: string;
    description: string;
    priority: string;
    supplier: string;
    poDate: string;
    deliveryDate: Date;
    port: string;
    amount: number;
    statusId: string;
}
