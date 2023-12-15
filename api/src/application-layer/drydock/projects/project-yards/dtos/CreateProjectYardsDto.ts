import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProjectYardsDto {
    @IsUUID()
    @IsNotEmpty()
    projectUid: string;

    @IsArray()
    @ArrayMinSize(0)
    yardsUids: Array<string>;
}
