import * as ExcelJS from 'exceljs';

import { transformHtmlToText } from '../../../common/drydock/ts-helpers/html-to-text';
import { IInvoiceRawDataDto } from '../../../dal/drydock/yards/dtos/InvoiceDataDto';
import { ApplicationException } from '../core/exceptions';
import { InvoiceFunctionDto, InvoiceJobDto, InvoicePreparedDataDto, InvoiceSubItemDto } from './dto/InvoiceDto';

type RichText = {
    text: string;
    font?: { bold: boolean; size: number; color: { theme: number }; name: string };
};

export class InvoiceGeneratorService {
    cRow = 17;
    sumArray: Array<string> = [];
    private finishReport(worksheet: ExcelJS.Worksheet, data: InvoicePreparedDataDto) {
        worksheet.getCell('A1').value = data.invoiceId;
        worksheet.getCell('A1').numFmt = ';;;';
        worksheet.getCell('D8').value = '';
        worksheet.getCell('D8').protection = {
            locked: false,
        };
        worksheet.getCell('C7').value = data.vessel;
        worksheet.getCell('C8').value = data.requestedBy;
        worksheet.getCell('C9').value = data.yard;
        worksheet.getCell('C10').value = data.project;
        worksheet.getCell('C11').value = data.period;
        worksheet.getCell('C12').dataValidation = {
            type: 'list',
            formulae: [`"${data.currencies.join(',')}"`],
            allowBlank: false,
            showErrorMessage: true,
            errorTitle: 'Invalid Value',
            error: 'Please select a value from the list',
        };
        if (data.currencies.length) {
            worksheet.getCell('C12').value = data.currencies[0];
        }
        worksheet.getCell('C12').protection = {
            locked: false,
        };
        worksheet.getCell('C13').value = 0;
        worksheet.getCell('C13').protection = {
            locked: false,
        };
        worksheet.getCell('C14').value = '';
        worksheet.getCell('C14').protection = {
            locked: false,
        };
        worksheet.getCell('C15').value = '';
        worksheet.getCell('C15').protection = {
            locked: false,
        };
        if (this.sumArray.length) {
            worksheet.getCell('H12').value = {
                formula: `SUM(${this.sumArray.join(',')})`,
            };
        } else {
            worksheet.getCell('H12').value = 0;
        }
        worksheet.getRow(this.cRow).height = 30;
        worksheet.mergeCells(`B${this.cRow}:I${this.cRow}`);
        worksheet.getCell(`B${this.cRow}`).value = '';
        const ftStyle = {
            font: { bold: true, size: 10, color: { theme: 0 }, name: 'Arial' },
            border: {
                left: { style: 'medium', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'medium', color: { argb: 'FF000000' } },
                right: { style: 'medium', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0E2841' },
                bgColor: { argb: 'FF0E2841' },
            },
            alignment: { horizontal: 'center', vertical: 'middle' },
        } as ExcelJS.Style;
        worksheet.getCell(`B${this.cRow}`).style = ftStyle;
        worksheet.getCell(`C${this.cRow}`).style = ftStyle;
        worksheet.getCell(`D${this.cRow}`).style = ftStyle;
        worksheet.getCell(`E${this.cRow}`).style = ftStyle;
        worksheet.getCell(`F${this.cRow}`).style = ftStyle;
        worksheet.getCell(`G${this.cRow}`).style = ftStyle;
        worksheet.getCell(`H${this.cRow}`).style = ftStyle;
        worksheet.getCell(`I${this.cRow}`).style = ftStyle;
        worksheet.getCell(`A${this.cRow}`).value = data.invoiceId;
        worksheet.getCell(`A${this.cRow}`).numFmt = ';;;';
    }

    private addFunctionHeader(worksheet: ExcelJS.Worksheet, name: string) {
        worksheet.getRow(this.cRow).height = 30;
        worksheet.mergeCells(`B${this.cRow}:I${this.cRow}`);
        worksheet.getCell(`B${this.cRow}`).value = name;
        const hStyle = {
            font: { bold: true, size: 10, color: { theme: 0 }, name: 'Arial' },
            border: {
                left: { style: 'medium', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'medium', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0E2841' },
                bgColor: { argb: 'FF0E2841' },
            },
            alignment: { horizontal: 'left', vertical: 'middle' },
        } as ExcelJS.Style;
        worksheet.getCell(`B${this.cRow}`).style = hStyle;
        worksheet.getCell(`C${this.cRow}`).style = hStyle;
        worksheet.getCell(`D${this.cRow}`).style = hStyle;
        worksheet.getCell(`E${this.cRow}`).style = hStyle;
        worksheet.getCell(`F${this.cRow}`).style = hStyle;
        worksheet.getCell(`G${this.cRow}`).style = hStyle;
        worksheet.getCell(`H${this.cRow}`).style = hStyle;
        worksheet.getCell(`I${this.cRow}`).style = hStyle;
        this.cRow++;
    }
    private addSpecificationHeader(
        worksheet: ExcelJS.Worksheet,
        specificationCode: string,
        specificationSubject: string,
        specificationDescription: string | null,
    ) {
        worksheet.getCell(`B${this.cRow}`).value = specificationCode;
        worksheet.getCell(`B${this.cRow}`).style = {
            font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'medium', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { horizontal: 'left', vertical: 'top' },
        };

        worksheet.mergeCells(`C${this.cRow}:I${this.cRow}`);
        const richText: RichText[] = [
            { text: specificationSubject, font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' } },
        ];

        if (specificationDescription && specificationDescription.length) {
            richText.push({
                text: `\n${specificationDescription}`,
                font: { bold: false, size: 10, color: { theme: 1 }, name: 'Arial' },
            });
            worksheet.getRow(this.cRow).height = 36;
        }
        worksheet.getCell(`C${this.cRow}`).value = {
            richText,
        };
        const hStyle = {
            border: {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'medium', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { horizontal: 'left', vertical: 'top', wrapText: true },
        } as ExcelJS.Style;
        worksheet.getCell(`C${this.cRow}`).style = hStyle;
        worksheet.getCell(`D${this.cRow}`).style = hStyle;
        worksheet.getCell(`E${this.cRow}`).style = hStyle;
        worksheet.getCell(`F${this.cRow}`).style = hStyle;
        worksheet.getCell(`G${this.cRow}`).style = hStyle;
        worksheet.getCell(`H${this.cRow}`).style = hStyle;
        worksheet.getCell(`I${this.cRow}`).style = hStyle;
        this.cRow++;
    }
    private addSubItem(worksheet: ExcelJS.Worksheet, item: InvoiceSubItemDto) {
        const { code, description, subject, qty, uom, price, discount, comment, technicalData } = item;
        worksheet.getCell(`A${this.cRow}`).value = technicalData;
        worksheet.getCell(`A${this.cRow}`).numFmt = ';;;';

        worksheet.getCell(`B${this.cRow}`).value = code;
        worksheet.getCell(`B${this.cRow}`).style = {
            font: { size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'medium', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { horizontal: 'left', vertical: 'top' },
        };

        let value = subject;
        if (description && description.length) {
            worksheet.getRow(this.cRow).height = 36;
            value += `\n${description}`;
        }
        worksheet.getCell(`C${this.cRow}`).value = value;
        worksheet.getCell(`C${this.cRow}`).style = {
            font: { size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { horizontal: 'left', vertical: 'top', wrapText: true },
        };

        worksheet.getCell(`D${this.cRow}`).value = qty;
        worksheet.getCell(`D${this.cRow}`).style = {
            numFmt: '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)',
            font: { size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDBE9F9' },
                bgColor: { argb: 'FFDBE9F9' },
            },
            alignment: { horizontal: 'right', vertical: 'top' },
        };
        worksheet.getCell(`D${this.cRow}`).protection = {
            locked: false,
        };

        worksheet.getCell(`E${this.cRow}`).value = uom;
        worksheet.getCell(`E${this.cRow}`).style = {
            font: { size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDBE9F9' },
                bgColor: { argb: 'FFDBE9F9' },
            },
            alignment: { horizontal: 'left', vertical: 'top' },
        };
        worksheet.getCell(`E${this.cRow}`).protection = {
            locked: false,
        };

        worksheet.getCell(`F${this.cRow}`).value = price;
        worksheet.getCell(`F${this.cRow}`).style = {
            numFmt: '#,##0.00 _k_r_.;[Red]#,##0.00 _k_r_.',
            font: { size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDBE9F7' },
                bgColor: { argb: 'FFDBE9F7' },
            },
            alignment: { vertical: 'top', wrapText: true, shrinkToFit: false },
        };
        worksheet.getCell(`F${this.cRow}`).protection = {
            locked: false,
        };

        worksheet.getCell(`G${this.cRow}`).value = discount;
        worksheet.getCell(`G${this.cRow}`).style = {
            numFmt: '0.00%',
            font: { size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDBE9F9' },
                bgColor: { argb: 'FFDBE9F9' },
            },
            alignment: { horizontal: 'right', vertical: 'top' },
        };
        worksheet.getCell(`G${this.cRow}`).protection = {
            locked: false,
        };

        worksheet.getCell(`G${this.cRow}`).dataValidation = {
            type: 'decimal',
            operator: 'between',
            formulae: [0, 1],
            allowBlank: true,
            showInputMessage: true,
            promptTitle: 'Discount',
            prompt: 'The value must between 0 and 100',
            showErrorMessage: true,
            errorTitle: 'Invalid Value',
            error: 'Please enter a value between 0 and 100',
        };

        worksheet.getCell(`H${this.cRow}`).value = {
            formula: `IF(ISNUMBER(D${this.cRow}),(D${this.cRow}*F${this.cRow})-(D${this.cRow}*F${this.cRow}*G${this.cRow}),"")`,
        };
        worksheet.getCell(`H${this.cRow}`).style = {
            numFmt: '#,##0.00 _k_r_.;[Red]#,##0.00 _k_r_.',
            font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { vertical: 'top', wrapText: true, shrinkToFit: false },
        };

        worksheet.getCell(`I${this.cRow}`).value = comment;
        worksheet.getCell(`I${this.cRow}`).style = {
            font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'medium', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDBE9F7' },
                bgColor: { argb: 'FFDBE9F7' },
            },
            alignment: {
                horizontal: 'left',
                vertical: 'top',
                wrapText: true,
                shrinkToFit: false,
            },
        };
        worksheet.getCell(`I${this.cRow}`).protection = {
            locked: false,
        };

        this.cRow++;
    }
    private addSpecificationFooter(worksheet: ExcelJS.Worksheet, startRow: number, specificationUid: string) {
        const passwordFreeCol = ['C', 'D', 'E', 'F', 'G', 'I'];
        for (let i = 0; i < 3; i++) {
            worksheet.getCell(`A${this.cRow}`).value = specificationUid;
            worksheet.getCell(`A${this.cRow}`).numFmt = ';;;';
            worksheet.getCell(`B${this.cRow}`).style = {
                font: { size: 10, color: { theme: 1 }, name: 'Aptos narrow' },
                border: {
                    left: { style: 'medium', color: { argb: 'FF000000' } },
                    right: { style: 'dotted', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD8D8D8' },
                    bgColor: { argb: 'FFD8D8D8' },
                },
                alignment: { horizontal: 'left' },
            };
            worksheet.getCell(`C${this.cRow}`).style = {
                font: { size: 10, color: { theme: 1 }, name: 'Aptos narrow' },
                border: {
                    left: { style: 'dotted', color: { argb: 'FF000000' } },
                    right: { style: 'dotted', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDCE9F9' },
                    bgColor: { argb: 'FFDCE9F9' },
                },
                alignment: { horizontal: 'left' },
            };
            worksheet.getCell(`D${this.cRow}`).style = {
                numFmt: '_(* #,##0_);_(* (#,##0);_(* "-"??_);_(@_)',
                font: { size: 10, color: { theme: 1 }, name: 'Arial' },
                border: {
                    left: { style: 'dotted', color: { argb: 'FF000000' } },
                    right: { style: 'dotted', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDBE9F9' },
                    bgColor: { argb: 'FFDBE9F9' },
                },
                alignment: { horizontal: 'right', vertical: 'top' },
            };
            worksheet.getCell(`E${this.cRow}`).style = {
                font: { size: 10, color: { theme: 1 }, name: 'Arial' },
                border: {
                    left: { style: 'dotted', color: { argb: 'FF000000' } },
                    right: { style: 'dotted', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDBE9F9' },
                    bgColor: { argb: 'FFDBE9F9' },
                },
                alignment: { horizontal: 'left' },
            };
            worksheet.getCell(`F${this.cRow}`).style = {
                numFmt: '#,##0.00 _k_r_.;[Red]#,##0.00 _k_r_.',
                font: { size: 10, color: { theme: 1 }, name: 'Arial' },
                border: {
                    left: { style: 'dotted', color: { argb: 'FF000000' } },
                    right: { style: 'dotted', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDBE9F7' },
                    bgColor: { argb: 'FFDBE9F7' },
                },
                alignment: { vertical: 'top', wrapText: true, shrinkToFit: false },
            };
            worksheet.getCell(`G${this.cRow}`).style = {
                numFmt: '0.00%',
                font: { size: 10, color: { theme: 1 }, name: 'Arial' },
                border: {
                    left: { style: 'dotted', color: { argb: 'FF000000' } },
                    right: { style: 'dotted', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDBE9F9' },
                    bgColor: { argb: 'FFDBE9F9' },
                },
                alignment: { horizontal: 'right', vertical: 'top' },
            };
            worksheet.getCell(`H${this.cRow}`).value = {
                formula: `IF(ISNUMBER(D${this.cRow}),(D${this.cRow}*F${this.cRow})-(D${this.cRow}*F${this.cRow}*G${this.cRow}),"")`,
            };
            worksheet.getCell(`H${this.cRow}`).style = {
                numFmt: '#,##0.00 _k_r_.;[Red]#,##0.00 _k_r_.',
                font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
                border: {
                    left: { style: 'dotted', color: { argb: 'FF000000' } },
                    right: { style: 'dotted', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFD8D8D8' },
                    bgColor: { argb: 'FFD8D8D8' },
                },
                alignment: { vertical: 'top', wrapText: true, shrinkToFit: false },
            };
            worksheet.getCell(`I${this.cRow}`).style = {
                font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
                border: {
                    left: { style: 'dotted', color: { argb: 'FF000000' } },
                    right: { style: 'medium', color: { argb: 'FF000000' } },
                    top: { style: 'dotted', color: { argb: 'FF000000' } },
                    bottom: { style: 'dotted', color: { argb: 'FF000000' } },
                },
                fill: {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFDBE9F7' },
                    bgColor: { argb: 'FFDBE9F7' },
                },
                alignment: {
                    horizontal: 'left',
                    vertical: 'top',
                    wrapText: true,
                    shrinkToFit: false,
                },
            };
            passwordFreeCol.forEach((col) => {
                const cell = `${col}${this.cRow}`;
                worksheet.getCell(cell).protection = {
                    locked: false,
                };
            });
            this.cRow++;
        }
        worksheet.mergeCells(`B${this.cRow}:G${this.cRow}`);
        worksheet.getCell(`B${this.cRow}`).style = {
            font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
            border: { left: { style: 'medium', color: { argb: 'FF000000' } } },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { horizontal: 'right', vertical: 'middle' },
        };
        worksheet.getCell(`B${this.cRow}`).value = 'Job Total';

        worksheet.getCell(`H${this.cRow}`).style = {
            numFmt: '#,##0.00 _k_r_.;[Red]#,##0.00 _k_r_.',
            font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
            border: {
                left: { style: 'dotted', color: { argb: 'FF000000' } },
                right: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { vertical: 'top', wrapText: true, shrinkToFit: false },
        };
        worksheet.getCell(`H${this.cRow}`).value = {
            formula: `SUM(H${startRow}:H${this.cRow - 1})`,
        };
        worksheet.getCell(`I${this.cRow}`).style = {
            font: { size: 10, color: { theme: 1 }, name: 'Arial' },
            border: { right: { style: 'medium', color: { argb: 'FF000000' } } },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { horizontal: 'left', vertical: 'top' },
        };
        this.sumArray.push(`H${this.cRow}`);
        this.cRow++;
    }
    private addFunctions(worksheet: ExcelJS.Worksheet, functions: Array<InvoiceFunctionDto>) {
        functions.forEach((func) => {
            const { name, jobs } = func;
            this.addFunctionHeader(worksheet, name);
            jobs.forEach((job: InvoiceJobDto) => {
                const {
                    specificationCode,
                    specificationDescription,
                    subItems,
                    specificationSubject,
                    specificationUid,
                } = job;
                this.addSpecificationHeader(
                    worksheet,
                    specificationCode,
                    specificationSubject,
                    specificationDescription,
                );
                const startRow = this.cRow;
                subItems.forEach((item: InvoiceSubItemDto) => {
                    this.addSubItem(worksheet, item);
                });
                this.addSpecificationFooter(worksheet, startRow, specificationUid);
            });
        });
    }
    public async generateInvoice(data: InvoicePreparedDataDto): Promise<ExcelJS.Buffer> {
        this.cRow = 17;
        this.sumArray = [];
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(`${__dirname}/../../../assets/drydock/Yard Quotation Template.xlsx`);
        const reportWorksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet;
        this.addFunctions(reportWorksheet, data.functions);
        this.finishReport(reportWorksheet, data);
        const password = process.env.DRY_DOCK_YARD_REPORT_PASSWORD;
        if (!password) {
            throw new ApplicationException(
                `Can't protect report worksheet. Environment variable "DRY_DOCK_YARD_REPORT_PASSWORD" is not set`,
            );
        }
        await reportWorksheet.protect(password, {});
        reportWorksheet.views = [{ state: 'frozen', xSplit: 1, ySplit: 16, topLeftCell: 'B17' }];
        return workbook.xlsx.writeBuffer();
    }
    public prepareData(data: Array<IInvoiceRawDataDto>): InvoicePreparedDataDto {
        const obj: InvoicePreparedDataDto = {} as InvoicePreparedDataDto;
        obj.vessel = data[0].VesselName;
        obj.invoiceId = data[0].ProjectUid;
        obj.requestedBy = data[0].ManagementCompany;
        obj.yard = data[0].YardName;
        obj.project = data[0].Subject;
        obj.period = `${data[0].StartDate ? this.formatDateString(data[0].StartDate) : 'N/A'} - ${
            data[0].EndDate ? this.formatDateString(data[0].EndDate) : 'N/A'
        }`;
        obj.functions = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            if (!row.Function) break;
            let functionIndex = obj.functions.findIndex((item: InvoiceFunctionDto) => row.Function === item.name);
            if (functionIndex === -1) {
                functionIndex = obj.functions.length;
                obj.functions.push({
                    name: row.Function,
                    jobs: [],
                });
            }
            let jobIndex = obj.functions[functionIndex].jobs.findIndex(
                (item: InvoiceJobDto) => item.specificationCode === row.SpecificationCode,
            );
            if (jobIndex === -1) {
                jobIndex = obj.functions[functionIndex].jobs.length;
                obj.functions[functionIndex].jobs.push({
                    specificationCode: row.SpecificationCode,
                    specificationSubject: row.SpecificationSubject,
                    specificationDescription: transformHtmlToText(row.SpecificationDescription),
                    specificationUid: row.SpecificationUid,
                    subItems: [],
                });
            }
            if (row.ItemNumber) {
                const itemObj = {
                    uid: row.ItemUid,
                    uom: row.ItemUOM,
                    qty: row.ItemQTY,
                    unitPrice: row.ItemUnitPrice,
                    discount: row.ItemDiscount,
                    comments: row.ItemComment,
                };
                obj.functions[functionIndex].jobs[jobIndex].subItems.push({
                    technicalData: JSON.stringify(itemObj),
                    code: `${row.SpecificationNumber}.${row.ItemNumber}`,
                    subject: row.ItemSubject,
                    qty: row.ItemQTY,
                    uom: row.ItemUOM,
                    price: row.ItemUnitPrice,
                    discount: row.ItemDiscount,
                    comment: row.ItemComment,
                    description: transformHtmlToText(row.ItemDescription),
                });
            }
        }
        obj.filename = `${obj.vessel.split(' ').join('-')}-${obj.yard}-${new Date(
            data[0].StartDate,
        ).getFullYear()}-${this.getFileNameDate()}`;

        obj.currencies = [];
        if (data[0].YardCurrencies) {
            obj.currencies = JSON.parse(data[0].YardCurrencies);
        }

        return obj;
    }
    private getFileNameDate() {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        return day + month + year;
    }
    private formatDateString(inputDateString: string) {
        const date = new Date(inputDateString);
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
        return formattedDate.toUpperCase();
    }
}
