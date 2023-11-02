import { ApiRequestService } from 'j2utils';

export class TaskManagerRequestDto {
    public Office_ID: number;
    public Vessel_ID: number;
    public Vessel_Name: string;
    public Is_Office: number;
    public Job_Status: null;
    public wl_type: string;
    public expected_completion_date: Date;
    public vessel_uid: string;
    public module_code: string;
    public function_code: string;
    public raised_location: number;
    public task_status: string;
    public title: string;
    public date_raised: Date;
    public link_job_uid: null;
    public parent_uid: null;
}

export class TaskManagerService {
    public async TaskManagerIntegration(body: TaskManagerRequestDto, token: string): Promise<any> {
        // Method is used to save sign off task manager details.
        const apiPath = `task-manager/save-task-manager-jobs`;
        const { data } = await new ApiRequestService().taskManager(token, apiPath, 'post', body);
        return data.taskManagerJobDetail;
    }
}
