import { IsNotEmpty } from 'class-validator';

export class GetStatementOfFactsDto {
    @IsNotEmpty()
    odata: object;
}
