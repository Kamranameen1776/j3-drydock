import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { File } from 'tsoa';

export type ExcelTypes =
    | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    | 'application/vnd.ms-excel'
    | 'application/msexcel'
    | 'application/x-msexcel'
    | 'application/x-ms-excel'
    | 'application/x-excel'
    | 'application/x-dos_ms_excel'
    | 'application/xls'
    | 'application/x-xls';

interface IsFileOptions {
    mime: (string | ExcelTypes)[];
}

/**
 * Custom decorator for file validation
 * @param options
 * @param validationOptions
 * @constructor
 */
export function IsFile(
    options: IsFileOptions,
    validationOptions: ValidationOptions = { message: 'File type is not allowed' },
) {
    return function (object: object, propertyName: string) {
        return registerDecorator({
            name: 'isFile',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: validationOptions,
            validator: {
                validate(value: File) {
                    return !!(value?.mimetype && (options?.mime ?? []).includes(value?.mimetype));
                },
                defaultMessage: () => {
                    return <string>validationOptions.message;
                },
            },
        });
    };
}
