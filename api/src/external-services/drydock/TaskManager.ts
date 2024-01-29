/* eslint-disable @typescript-eslint/naming-convention */
import { ApiRequestService } from 'j2utils';

import { TaskManagerConstants } from '../../shared/constants';

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

export interface JmsAttachmentsDetails {
    Creater_Name: string; // Example: "Akshay Bummera"
    Rank_Name: string;
    Rank_Short_Name: string;
    User_Type: string; // Example: "OFFICE USER"
    WL_TYPE: string; // Example: "specification"
    active_status: number; // Example: 1
    category_uid: null;
    created_by: number; // Example: 345000463
    date_of_creation: string; // Example: "2024-01-17"
    date_of_modification: null;
    file_type: string; // Example: "application/pdf"
    first_name: string; // Example: "Akshay"
    function_code: string; // Example: "specification_details"
    key1: string; // Example: "B3E70E04-7C2D-45C9-9739-CC98EC81F2DF"
    key2: string; // Example: "1"
    key3: string; // Example: "113"
    key4: string; // Example: "B3E70E04-7C2D-45C9-9739-CC98EC81F2DF"
    label: null;
    last_name: string; // Example: "Bummera"
    modified_by: null;
    module_code: string; // Example: "project"
    size: number; // Example: 141.093
    upload_file_name: string; // Example: "undefined Report-undefined-undefined 13.23.00.pdf"
    upload_file_path: string; // Example: "/project/specification_details/projspec_undefinedReport-undefined-undefined13_guida688964e-349b-44e2-a812-8a693f99f2ad.pdf"
    upload_file_remark: null;
    upload_uid: string; // Example: "B422033A-33DB-4AE2-AAFB-0377696862CC"
}

export enum JmsAttachmentFileType {
    Media = 'media',
    File = 'file',
}

export class TaskManagerService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public async TaskManagerIntegration(body: TaskManagerRequestDto, token: string): Promise<any> {
        // Method is used to save sign off task manager details.
        const apiPath = `task-manager/save-task-manager-jobs`;
        const { data } = await new ApiRequestService().taskManager(token, apiPath, 'post', body);
        return data.taskManagerJobDetail;
    }

    public async DeleteTaskManagerIntegration(uid: string, token: string): Promise<void> {
        const data = {
            task_manager_uid: uid,
        };
        const apiPath = `task-manager/delete-task-manager-job-by-uid`;
        await new ApiRequestService().taskManager(token, apiPath, 'post', data);
    }

    public async getJmsAttachmentDetails(
        token: string,
        {
            taskManagerUid,
            vesselId,
            officeId,
            fileType,
        }: { taskManagerUid: string; vesselId: string; officeId: number; fileType: JmsAttachmentFileType },
    ) {
        const params = {
            wlType: TaskManagerConstants.specification.wlType,
            fileType,
            $filter: `(key1 eq '${taskManagerUid}') and (key2 eq '${officeId}') and (key3 eq '${vesselId}') and (active_status eq 1)`,
            $orderby: 'upload_file_name',
        };
        const apiPath = `jms/jms_attachment/getJmsAttachmentDetails`;
        const {
            data: { records },
        }: { data: { records: JmsAttachmentsDetails[] } } = await new ApiRequestService().taskManager(
            token,
            apiPath,
            'get',
            null,
            undefined,
            params,
        );
        return records;
    }
}
