export interface IUploadInvoiceRawDataUpdateDto {
    technicalData: string;
    qty: number;
    uom: string;
    unitPrice: string;
    discount: string;
    comments: string;
}

export interface IUploadInvoiceRawDataCreateDto {
    technicalData: string;
    qty: number;
    uom: string;
    unitPrice: string;
    discount: string;
    comments: string;
    description: string;
}

export interface IUploadRawDataDto {
    invoiceId: string;
    update: Array<IUploadInvoiceRawDataUpdateDto>;
    create: Array<IUploadInvoiceRawDataCreateDto>;
}
