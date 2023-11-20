import { CreateProjectDto } from '../../../../bll/drydock/projects/dtos/ICreateProjectDto';

export class CreateProjectDataDto {
    public Token: string;

    public ProjectDto: CreateProjectDto;
}
