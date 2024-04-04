import { TaskManagerStatus } from '../enum/task-manager-status.enum';

export const TaskManagerConstants = {
    project: {
        wlType: 'dry_dock',
        module_code: 'project',
        function_code: 'dry_dock',
        status: {
            Planned: 'RAISE',
            InProgress: 'IN PROGRESS',
            Rejected: 'REJECTED',
            Completed: 'COMPLETED',
        },
    },
    specification: {
        wlType: 'specification',
        module_code: 'project',
        function_code: 'specification_details',
        status: {
            Raised: TaskManagerStatus.Raised,
            InProgress: TaskManagerStatus.InProgress,
            Planned: TaskManagerStatus.Planned,
            Closed: TaskManagerStatus.Closed,
            Canceled: TaskManagerStatus.Canceled,
        },
    },
    standardJob: {
        module_code: 'project',
        function_code: 'standard_job',
    },
};
