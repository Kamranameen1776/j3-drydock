import * as ExcelJS from 'exceljs';

export class ReportGeneratorService {
    cRow = 17;
    sumArray: Array<string> = [];
    private finishReport(worksheet: ExcelJS.Worksheet, data: any) {
        worksheet.getCell('C3').value = data.notes;
        worksheet.getCell('C3').protection = {
            locked: false,
        };
        worksheet.getCell('D8').value = '';
        worksheet.getCell('D8').protection = {
            locked: false,
        };
        worksheet.getCell('C7').value = data.vessel;
        worksheet.getCell('C8').value = data.requestedBy;
        worksheet.getCell('C9').value = data.yard;
        worksheet.getCell('C10').value = data.project;
        worksheet.getCell('C11').value = data.period;
        worksheet.getCell('C12').value = data.currency;
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
        worksheet.getCell('H12').value = {
            formula: `SUM(${this.sumArray.join(',')})`,
        };

        worksheet.getRow(this.cRow).height = 30;
        worksheet.mergeCells(`B${this.cRow}:I${this.cRow}`);
        worksheet.getCell(`B${this.cRow}`).value = data.footer;
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
        const hStyle = {
            font: { bold: true, size: 10, color: { theme: 1 }, name: 'Arial' },
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
            alignment: { horizontal: 'left' },
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
            alignment: { horizontal: 'left' },
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
        await workbook.xlsx.readFile(`${__dirname}/../../../assets/drydock/Yard Quotation Template.xlsx`);
        const worksheet = workbook.getWorksheet(1) as ExcelJS.Worksheet;

        this.addFunctions(worksheet, data.functions);
        this.finishReport(worksheet, data);
        const password = process.env.YARD_REPORT_PASSWORD as string;
        await worksheet.protect(password, {});
        return workbook;
    }
    public prepareData(data: Array<any>) {
        const obj: any = {};
        //set header
        obj.notes = '';
        obj.vessel = data[0].VesselName;
        obj.requestedBy = data[0].ManagementCompany;
        obj.yard = data[0].YardName;
        obj.project = data[0].Subject;
        obj.currency = 'EUR';
        obj.period = `${this.formatDateString(data[0].StartDate)} - ${this.formatDateString(data[0].EndDate)}`;
        obj.functions = [];
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            let functionIndex = obj.functions.findIndex((item: any) => row.Function === item.name);
            if (functionIndex === -1) {
                functionIndex = obj.functions.length;
                obj.functions.push({
                    name: row.Function,
                    jobs: [],
                });
            }
            let jobIndex = obj.functions[functionIndex].jobs.findIndex(
                (item: any) => item.specificationCode === row.SpecificationCode,
            );
            if (jobIndex === -1) {
                jobIndex = obj.functions[functionIndex].jobs.length;
                obj.functions[functionIndex].jobs.push({
                    specificationCode: row.SpecificationCode,
                    specificationDescription: row.SpecificationSubject,
                    subItems: [],
                });
            }
            if (row.ItemNumber) {
                obj.functions[functionIndex].jobs[jobIndex].subItems.push({
                    code: `${row.SpecificationNumber}.${row.ItemNumber}`,
                    description: row.ItemSubject,
                    qty: row.ItemQTY,
                    uom: row.ItemUOM,
                    price: row.ItemUnitPrice,
                    discount: row.ItemDiscount,
                    comment: '',
                });
            }
        }
        obj.filename = `${obj.vessel}-${obj.yard}-${new Date(
            data[0].StartDate,
        ).getFullYear()}-${this.getFileNameDate()}`;

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
