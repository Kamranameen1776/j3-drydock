export const TaskManagerConstants = {
    project: {
        wlType: 'dry_dock',
        module_code: 'project',
        function_code: 'dry_dock',
        status: {
            Planned: 'RAISE',
            InProgress: 'In Porgress',
            Rejected: 'Rejected',
            Completed: 'Completeed',
        },
    },
    specification: {
        wlType: 'specification',
        module_code: 'project',
        function_code: 'specification_details',
        status: {
            Raised: 'Raise',
            Approved: 'Approved',
            Rejected: 'Rejected',
            Completed: 'Completed',
        },
    },
};
