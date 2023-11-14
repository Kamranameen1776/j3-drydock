import { ArrayMinSize, IsArray, IsUUID } from 'class-validator';

export class CreateProjectYardsDto {
    @IsUUID()
    projectUid: string;

    @IsArray()
    @ArrayMinSize(0)
    yardsUids: Array<string>;
}
