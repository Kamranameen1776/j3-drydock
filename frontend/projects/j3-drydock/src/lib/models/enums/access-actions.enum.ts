export enum eStandardJobsAccessActions {
  viewGrid = 'view_standard_job_grid',
  viewDetail = 'view_standard_job_detail',
  createJob = 'create_standard_job',
  editJob = 'edit_standard_job',
  deleteJob = 'delete_standard_job'
}

export enum eProjectsAccessActions {
  viewGrid = 'view_projects_list',
  createProject = 'create_dry_dock_project',
  deleteProject = 'delete',
  viewDetail = 'view_details_dry_dock_project',
  viewGridVessel = 'view_projects_list_onboard',
  viewDetailVessel = 'view_dd_project_details_onb'
}

export enum eProjectsDetailsAccessActions {
  viewAttachments = 'view_dry_dock_project_att',
  editHeader = 'edit_dd_project_header',
  addOrEditFeedDiscussion = 'edit_dd_project_flow',
  addAttachments = 'add_dd_project_att',
  editAttachments = 'edit_dd_project_att',
  deleteAttachments = 'delete_dd_project_att',

  viewAttachmentsVessel = 'view_dd_project_att_onb',
  editHeaderVessel = 'edit_dd_project_header_onb',
  addOrEditFeedDiscussionVessel = 'edit_dd_project_flow_onb',
  addAttachmentsVessel = 'add_dd_project_att_onb',
  editAttachmentsVessel = 'edit_dd_project_att_onb',
  deleteAttachmentsVessel = 'delete_dd_project_att_onb'
}
