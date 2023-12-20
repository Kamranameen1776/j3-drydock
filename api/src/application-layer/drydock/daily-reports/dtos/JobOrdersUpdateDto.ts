import { MaxLength, MinLength } from 'class-validator';

export class JobOrdersUpdateDto {
    @MinLength(1)
    @MaxLength(200)
    Name: string;

    @MinLength(1)
    @MaxLength(5000)
    Remark: string;
}
