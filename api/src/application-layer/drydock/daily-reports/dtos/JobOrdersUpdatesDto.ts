import { MaxLength, MinLength } from 'class-validator';

export class JobOrdersUpdatesDto {
    @MinLength(1)
    @MaxLength(200)
    Name: string;

    @MinLength(1)
    @MaxLength(5000)
    Remark: string;
}
