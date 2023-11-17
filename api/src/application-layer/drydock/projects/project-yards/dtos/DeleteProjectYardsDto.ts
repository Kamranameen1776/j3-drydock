import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProjectYardsDto {
    @IsUUID()
    @IsNotEmpty()
    uid: string;
}
