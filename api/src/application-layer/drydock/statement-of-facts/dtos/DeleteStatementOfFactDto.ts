import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteStatementOfFactDto {
    @IsNotEmpty()
    @IsUUID(4)
    StatementOfFactUid: string;
}
