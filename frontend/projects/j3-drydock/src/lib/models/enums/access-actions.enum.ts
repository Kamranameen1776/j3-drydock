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

export enum eSpecificationAccessActions {
  viewSpecificationDetail = 'view_spec',
  viewGeneralInformationSection = 'view_gen_info_section',
  viewRequisitionSection = 'view_requisition_section',
  viewSubItemsSection = 'view_sub_items_section',
  viewFindingsSection = 'view_findings_section',
  viewPmsJobsTab = 'view_pms_jobs_tab',
  viewAttachmentsSection = 'view_attachments_section',
  viewSpecificationDetailOnboard = 'view_spec_onboard',
  viewGeneralInformationSectionOnboard = 'view_gen_info_section_onboard',
  viewRequisitionSectionOnboard = 'view_requisition_onboard',
  viewSubItemsSectionOnboard = 'view_sub_items_section_onboard',
  viewFindingsSectionOnboard = 'view_findings_section_onboard',
  viewPmsJobsTabOnboard = 'view_pms_jobs_tab_onboard',
  viewAttachmentsSectionOnboard = 'view_attachments_onboard',
  editHeaderSection = 'edit_header_section',
  editWorkflow = 'edit_workflow',
  editGeneralInformation = 'edit_general_information',
  editRequisition = 'edit_requisition',
  addSubItems = 'add_sub_items',
  editSubItems = 'edit_sub_items',
  deleteSubItems = 'delete_sub_items',
  addAttachments = 'add_attachments',
  editAttachments = 'edit_attachments',
  deleteAttachments = 'delete_attachments',
  editHeaderSectionOnboard = 'edit_header_section_onboard',
  editWorkflowOnboard = 'edit_workflow_onboard',
  editGeneralInformationOnboard = 'edit_gen_info_onboard',
  editRequisitionOnboard = 'edit_requisition_onboard',
  addSubItemsOnboard = 'add_sub_items_onboard',
  editSubItemsOnboard = 'edit_sub_items_onboard',
  deleteSubItemsOnboard = 'delete_sub_items_onboard',
  addAttachmentsOnboard = 'add_attachments_onboard',
  editAttachmentsOnboard = 'edit_attachments_onboard',
  deleteAttachmentsOnboard = 'delete_attachments_onboard',
  deleteSpecificationDetail = 'delete_specification_detail',
  deleteSpecificationDetailOnboard = 'delete_spec_onboard',
  resyncRecord = 'resync_record',
  resyncRecordOnboard = 'resync_record_onboard'
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
