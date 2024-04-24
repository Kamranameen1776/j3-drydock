import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetProjectTemplateModel {
    @IsNotEmpty()
    @IsUUID()
    ProjectTemplateUid: string;
}
