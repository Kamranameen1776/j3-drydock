import { IsNotEmpty, IsUUID } from 'class-validator';

// TODO: add more validation attributes

export class DeleteProjectTemplateModel {
    @IsNotEmpty()
    @IsUUID()
    public ProjectTemplateUid: string;

    @IsNotEmpty()
    DeletedBy: string;
}
