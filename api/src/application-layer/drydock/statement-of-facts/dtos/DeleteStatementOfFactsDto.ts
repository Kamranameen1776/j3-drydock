import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteStatementOfFactsDto {
    @IsNotEmpty()
    @IsUUID(4)
    uid: string;
}
