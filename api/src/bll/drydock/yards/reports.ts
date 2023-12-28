import * as ExcelJS from 'exceljs';

const obj = {
    title: 'SHIPYARD QUOTATION TEMPLATE',
    notes: `Please refer to the accompanying Drydock Specification for detailed description of repairs
Please observe that the format and layout of this document is maintained while edited. The document is subject to automated processing when returned.
Additional quoting rows can be created under each job, but the composition of columns are not to be altered.
The quotation currency MUST be the same for all quoted costs, and has to be chosen from the allowed list of currencies.`,
    yardRemark: `Quotation is provided basis our standard terms and conditions found here - www.keppel.com/terms.`,
    vessel: 'qwerty',
    requestedBy: 'ewq',
    yard: 'ds',
    project: 'SS1 - IMPERIA - 2024',
    period: '01 MARCH 1999 - 10 MARCH 2024',
    currency: 'EUR',
    discount: '20,00%',
    berthDays: 19,
    dockDays: 17,
    functions: [
        {
            name: 'qwerty->qwerty',
            jobs: [
                {
                    specificationCode: 'qwqwqw',
                    specificationDescription: 'qwerty',
                    subItems: [
                        {
                            code: 'dsa',
                            description: 'dsa',
                            qty: 2,
                            uom: 'UOM',
                            price: 500,
                            discount: '50%',
                            comment: 'comment',
                        },
                    ],
                },
            ],
        },
    ],
    footer: 'END OF SPECIFICATIONS',
};

export class ReportGeneratorService {
    cRow = 17;
    sumArray: Array<string> = [];
    private finishReport(worksheet: ExcelJS.Worksheet, data: any) {
        worksheet.getCell('B2').value = data.title;
        worksheet.getCell('C3').value = data.notes;
        worksheet.getCell('D8').value = data.yardRemark;

        worksheet.getCell('C7').value = data.vessel;
        worksheet.getCell('C8').value = data.requestedBy;
        worksheet.getCell('C9').value = data.yard;
        worksheet.getCell('C10').value = data.project;
        worksheet.getCell('C11').value = data.period;
        worksheet.getCell('C12').value = data.currency;
        worksheet.getCell('C13').value = data.discount;
        worksheet.getCell('C14').value = data.berthDays;
        worksheet.getCell('C15').value = data.dockDays;

        worksheet.getCell('H12').value = {
            formula: `SUM(${this.sumArray.join(',')})`,
        };

        worksheet.getRow(this.cRow).height = 30;
        worksheet.mergeCells(`B${this.cRow}:I${this.cRow}`);
        worksheet.getCell(`B${this.cRow}`).value = data.footer;
        worksheet.getCell(`B${this.cRow}`).style = {
            font: { bold: true, size: 10, color: { theme: 0 }, name: 'Arial' },
            border: {
                left: { style: 'medium', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
                bottom: { style: 'medium', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0E2841' },
                bgColor: { argb: 'FF0E2841' },
            },
            alignment: { horizontal: 'center', vertical: 'middle' },
        };
    }

    private addFunctionHeader(worksheet: ExcelJS.Worksheet, name: string) {
        worksheet.getRow(this.cRow).height = 30;
        worksheet.mergeCells(`B${this.cRow}:I${this.cRow}`);
        const cell = worksheet.getCell(`B${this.cRow}`);
        cell.value = name;
        cell.style = {
            font: { bold: true, size: 10, color: { theme: 0 }, name: 'Arial' },
            border: {
                left: { style: 'medium', color: { argb: 'FF000000' } },
                top: { style: 'dotted', color: { argb: 'FF000000' } },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF0E2841' },
                bgColor: { argb: 'FF0E2841' },
            },
            alignment: { horizontal: 'left', vertical: 'middle' },
        };
        this.cRow++;
    }
    private addSpecificationHeader(
        worksheet: ExcelJS.Worksheet,
        specificationCode: string,
        specificationDescription: string,
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
            alignment: { horizontal: 'left' },
        };

        worksheet.mergeCells(`C${this.cRow}:I${this.cRow}`);
        worksheet.getCell(`C${this.cRow}`).value = specificationDescription;
        worksheet.getCell(`C${this.cRow}`).style = {
            font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
            border: { top: { style: 'thin', color: { argb: 'FF000000' } } },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFD8D8D8' },
                bgColor: { argb: 'FFD8D8D8' },
            },
            alignment: { horizontal: 'left' },
        };

        this.cRow++;
    }
    private addSubItem(worksheet: ExcelJS.Worksheet, item: any) {
        const { code, description, qty, uom, price, discount, comment } = item;

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
            alignment: { horizontal: 'left' },
        };

        worksheet.getCell(`C${this.cRow}`).value = description;
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
            alignment: { horizontal: 'left' },
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

        this.cRow++;
    }
    private addSpecificatioFooter(worksheet: ExcelJS.Worksheet, startRow: number) {
        for (let i = 0; i < 3; i++) {
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
    private addFunctions(worksheet: ExcelJS.Worksheet, functions: Array<any>) {
        functions.forEach((func) => {
            const { name, jobs } = func;
            this.addFunctionHeader(worksheet, name);
            jobs.forEach((job: any) => {
                const { specificationCode, specificationDescription, subItems } = job;
                this.addSpecificationHeader(worksheet, specificationCode, specificationDescription);
                const startRow = this.cRow;
                subItems.forEach((item: any) => {
                    this.addSubItem(worksheet, item);
                });
                this.addSpecificatioFooter(worksheet, startRow);
            });
        });
    }
    public async generateReport(data: any) {
        this.cRow = 17;
        this.sumArray = [];
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile('Yard Quotation Template.xlsx');
        const worksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet;

        this.addFunctions(worksheet, data.functions);
        this.finishReport(worksheet, data);

        return workbook;
    }
}
