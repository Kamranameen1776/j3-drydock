import { CreateSpecificationDetailsDto } from 'application-layer/drydock/specification-details/dtos/CreateSpecificationDetailsDto';
import { LibVesselsEntity } from 'entity/drydock/dbo/LibVesselsEntity';
import { ApiRequestService, ConfigurationService } from 'j2utils';
import { TaskManagerConstants } from 'shared/constants/task-manager';

export class SpecificationService {
    apiRequestService = new ApiRequestService();

    public async IsOffice(): Promise<number> {
        const location = await ConfigurationService.getConfiguration('location');
        return location === 'office' ? 1 : 0;
    }

    public async TaskManagerIntegration(
        request: CreateSpecificationDetailsDto,
        vessel: LibVesselsEntity,
        token: string,
    ): Promise<any> {
        const office = await this.IsOffice();

        const saveTaskManagerDetails = {
            uid: null,
            Office_ID: office,
            Vessel_ID: vessel.VesselId,
            Vessel_Name: vessel.VesselName,
            Is_Office: office,
            Job_Status: null,
            wl_type: TaskManagerConstants.specification.wlType,
            expected_completion_date: new Date(),
            vessel_uid: vessel.uid,
            module_code: TaskManagerConstants.specification.module_code,
            function_code: TaskManagerConstants.specification.function_code,
            raised_location: office,
            task_status: TaskManagerConstants.project.status.Planned,
            title: request.Subject,
            date_raised: new Date(),
            link_job_uid: null,
            parent_uid: null,
        };
        // Method is used to save sign off task manager details.
        const apiPath = `task-manager/save-task-manager-jobs`;
        const { data } = await this.apiRequestService.taskManager(token, apiPath, 'post', saveTaskManagerDetails);
        return data.taskManagerJobDetail;
    }
}
