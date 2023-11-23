import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetProjectByUidDto {
    @IsNotEmpty()
    @IsUUID()
    public uid: string;
}
