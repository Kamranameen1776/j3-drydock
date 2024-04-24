export interface InvoiceSubItemDto {
    technicalData: string;
    code: string;
    description: string | null;
    qty: string;
    uom: string;
    price: number;
    discount: number;
    comment: string;
    subject: string;
}

export interface InvoiceJobDto {
    specificationCode: string;
    specificationSubject: string;
    specificationDescription: string | null;
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
