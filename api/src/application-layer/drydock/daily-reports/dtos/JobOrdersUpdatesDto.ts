import { MaxLength, MinLength } from 'class-validator';

export class JobOrdersUpdatesDto {
    @MinLength(1)
    @MaxLength(200)
    name: string;

    @MinLength(1)
    @MaxLength(5000)
    remark: string;

    specificationUid: string;

    specificationCode: string;

    status: string;

    progress: number;

    lastUpdated: Date;

    specificationSubject: string;
}
