import { ApplicationException } from '../../../../bll/drydock/core/exceptions/ApplicationException';
import { ProjectState } from '../../../../bll/drydock/entities/ProjectState';
import { ProjectType } from '../../../../bll/drydock/entities/ProjectType';

export class ProjectsService {
    public GetOfficeVesselFirstLetter(createdAtOffice: boolean): string {
        return createdAtOffice ? 'O' : 'V';
    }

    public GetCode(projectTypeCode: string, createdAtOffice: boolean, projectShortCodeId: number): string {
        return projectTypeCode + '-' + this.GetOfficeVesselFirstLetter(createdAtOffice) + '-' + projectShortCodeId;
    }

    public GetProjectTypeByProjectTypeCode(projectTypes: ProjectType[], projectTypeCode: string): ProjectType {
        const projectType = projectTypes.find((projectType) => projectType.ProjectTypeCode === projectTypeCode);

        if (!projectType) {
            throw new ApplicationException(`Project type with code ${projectTypeCode} not found`);
        }

        return projectType;
    }

    public GetProjectStateByProjectStateCode(projectStates: ProjectState[], projectStateCode: string): ProjectState {
        const projectState = projectStates.find((projectState) => projectState.ProjectStateCode === projectStateCode);

        if (!projectState) {
            throw new ApplicationException(`Project state with code ${projectStateCode} not found`);
        }

        return projectState;
    }
}
