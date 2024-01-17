export interface InvoiceSubItemDto {
    technicalData: string;
    code: string;
    description: string;
    qty: string;
    uom: string;
    price: number;
    discount: number;
    comment: string;
}

export interface InvoiceJobDto {
    specificationCode: string;
    specificationDescription: string;
    specificationUid: string;
    subItems: Array<InvoiceSubItemDto>;
}

export interface InvoiceFunctionDto {
    name: string;
    jobs: Array<InvoiceJobDto>;
}

export interface InvoicePreparedDataDto {
    vessel: string;
    invoiceId: string;
    requestedBy: string;
    yard: string;
    project: string;
    period: string;
    functions: Array<InvoiceFunctionDto>;
    filename: string;
    currencies: Array<string>;
}
