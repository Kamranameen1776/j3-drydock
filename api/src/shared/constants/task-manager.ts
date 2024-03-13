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
            Raised: 'RAISE',
            InProgress: 'IN PROGRESS',
            Planned: 'COMPLETE',
            Closed: 'CLOSE',
            Canceled: 'CANCEL',
        },
    },
    standardJob: {
        module_code: 'project',
        function_code: 'standard_job',
    },
};
