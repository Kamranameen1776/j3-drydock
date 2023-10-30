export const TaskManagerConstants = {
    project: {
        wlType: 'dry_dock',
        module_code: 'tm_drydock',
        function_code: 'tm_drydock_project',
        status: {
            Planned: 'Planned',
            InProgress: 'In Porgress',
            Rejected: 'Rejected',
            Completed: 'Completeed',
        },
    },
    specification: {
        wlType: 'dry_dock',
        module_code: 'tm_drydock',
        function_code: 'tm_drydock_specification',
        status: {
            Raised: 'Raised',
            Approved: 'Approved',
            Rejected: 'Rejected',
            Completed: 'Completed',
        },
    },
};
