import Decimal from 'decimal.js';

export interface HtmlCell {
    value: string | number | Decimal;
    cellStyle: string;
    cellClass?: string;
    iconPath?: string;
    iconMessage?: string;
    innerHTML: string | number | Decimal;
}
