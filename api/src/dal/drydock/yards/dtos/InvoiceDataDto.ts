export interface IInvoiceRawDataDto {
    SpecificationUid: string;
    StartDate: string;
    EndDate: string;
    Subject: string;
    VesselName: string;
    ManagementCompany: string;
    YardName: string;
    YardCurrencies: string;
    Function: string;
    SpecificationCode: string;
    SpecificationSubject: string;
    SpecificationNumber: string;
    ItemUid: string;
    ItemNumber: number;
    ItemUOM: string;
    ItemSubject: string;
    ItemQTY: string;
    ItemUnitPrice: number;
    ItemDiscount: number;
    ItemComment: string;
}
