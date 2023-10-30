import { LibVesselsEntity } from 'entity/drydock/dbo/LibVesselsEntity';
import { ConfigurationService } from 'j2utils';

import { ICreateProjectDto } from '../../../application-layer/drydock/projects/dtos/ICreateProjectDto';
import { TaskManagerRequestDto, TaskManagerService } from '../../../external-services/drydock/TaskManager';
import { TaskManagerConstants } from '../../../shared/constants';

export class ProjectService {
    tmSevice: TaskManagerService;

    constructor() {
        this.tmSevice = new TaskManagerService();
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
        const saveTaskManagerDetails: TaskManagerRequestDto = {
            Office_ID: request.CreatedAtOffice as number,
            Vessel_ID: vessel.VesselId,
            Vessel_Name: vessel.VesselName,
            Is_Office: request.CreatedAtOffice as number,
            Job_Status: null,
            wl_type: TaskManagerConstants.project.wlType,
            expected_completion_date: new Date(),
            vessel_uid: vessel.uid,
            module_code: TaskManagerConstants.project.module_code,
            function_code: TaskManagerConstants.project.function_code,
            raised_location: request.CreatedAtOffice as number,
            task_status: TaskManagerConstants.project.status.Planned,
            title: request.Subject,
            date_raised: new Date(),
            link_job_uid: null,
            parent_uid: null,
        };

        return this.tmSevice.TaskManagerIntegration(saveTaskManagerDetails, token);
    }
}
