import { LibVesselsEntity } from 'entity/drydock/dbo/LibVesselsEntity';
import { ApiRequestService, ConfigurationService } from 'j2utils';

import { ICreateProjectDto } from '../../../application-layer/drydock/projects/dtos/ICreateProjectDto';
import { TaskManagerConstants } from '../../../shared/constants';

export class ProjectService {
    public async GetProjectCode(): Promise<string> {
        // TODO: tmp change it after task-manager integration
        return `DD-${(await this.IsOffice()) ? 'O' : 'V'}-${Math.round(Math.random() * 1000 + 1)}`;
    }

    public async IsOffice(): Promise<number> {
        const location = await ConfigurationService.getConfiguration('location');
        return location === 'office' ? 1 : 0;
    }

    public async TaskManagerIntegration(
        request: ICreateProjectDto,
        vessel: LibVesselsEntity,
        token: string,
    ): Promise<any> {
        const saveTaskManagerDetails = {
            uid: null,
            Office_ID: request.CreatedAtOffice,
            Vessel_ID: vessel.VesselId,
            Vessel_Name: vessel.VesselName,
            Is_Office: request.CreatedAtOffice,
            Job_Status: null,
            wl_type: TaskManagerConstants.project.wlType,
            expected_completion_date: new Date(),
            vessel_uid: vessel.uid,
            module_code: TaskManagerConstants.project.module_code,
            function_code: TaskManagerConstants.project.function_code,
            raised_location: request.CreatedAtOffice,
            task_status: TaskManagerConstants.project.status.Planned,
            title: request.Subject,
            date_raised: new Date(),
            link_job_uid: null,
            parent_uid: null,
        };
        // Method is used to save sign off task manager details.
        const apiPath = `task-manager/save-task-manager-jobs`;
        const { data } = await new ApiRequestService().taskManager(token, apiPath, 'post', saveTaskManagerDetails);
        return data.taskManagerJobDetail;
    }
}
