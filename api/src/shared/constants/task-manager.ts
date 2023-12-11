export const TaskManagerConstants = {
    project: {
        wlType: 'dry_dock',
        module_code: 'tm_drydock',
        function_code: 'tm_drydock_project',
        status: {
            Planned: 'RAISE',
            InProgress: 'In Porgress',
            Rejected: 'Rejected',
            Completed: 'Completeed',
        },
    },
    specification: {
        wlType: 'dry_dock_spec',
        module_code: 'tm_drydock_spec',
        function_code: 'tm_drydock_spec',
        status: {
            Raised: 'Raise',
            Approved: 'Approved',
            Rejected: 'Rejected',
            Completed: 'Completed',
        },
    },
};
