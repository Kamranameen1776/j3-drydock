import {
  beSafeMenu,
  carMenu,
  certificateMenu,
  deficiencyMenu,
  externalInspectionMenu,
  incidentMenu,
  internalAuditMenu,
  internalInspectionMenu,
  mocMenu,
  nearMissMenu,
  nonPmMenu,
  nonPmNCRMenu,
  officeTaskMenu,
  onboardInspectionMenu,
  pscMenu,
  scmMenu,
  vesselTaskMenu
} from 'j3-task-manager-ng';
import {
  Column,
  TmLinkedRecordsDisplayNames,
  TmLinkedRecordsFieldNames,
  TmLinkedRecordsGridName,
  eFieldControlType,
  eJMSWLTYPE,
  eJMSWorklistType
} from 'jibe-components';

export const worklistType = {
  DRY_DOCK: {
    moduleCode: 'tm_drydock',
    functionCode: {
      index: 'tm_drydock_index',
      detail: 'tm_drydock_detail'
    },
    isTaskManagerJob: true
  },
  'CAMERA RECORD': {
    moduleCode: 'tm_jb_eye',
    functionCode: {
      index: 'tm_jb_eye_index',
      detail: 'tm_jb_eye_detail'
    },
    isTaskManagerJob: true
  },
  'NON-PM JOB': {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_non_pm_index',
      detail: 'jms_non_pm_detail'
    },
    taskIcon: 'icons8-mechanistic-analysis-2 observation font16',
    isTaskManagerJob: true,
    menuDetails: nonPmMenu,
    childLinkTypes: [
      { label: 'Observations', value: eJMSWLTYPE.NonPM },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  'NON-PM-NCR': {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_non_pm_ncr_index',
      detail: 'jms_non_pm_ncr_detail'
    },
    taskIcon: 'icons8-scorecard ncr font16',
    isTaskManagerJob: true,
    menuDetails: nonPmNCRMenu,
    childLinkTypes: [
      { label: 'Non-Conformity', value: eJMSWLTYPE.NonPMNCR },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  RECOMMENDATIONS: {
    moduleCode: 'tm_recommendation',
    functionCode: {
      index: 'tm_recommendation_index',
      detail: 'tm_recommendation_detail'
    },
    taskIcon: 'icons8-idea-sharing-2 recommendation font16',
    isTaskManagerJob: true,
    menuDetails: nonPmMenu,
    childLinkTypes: [
      { label: 'Recommendation', value: eJMSWLTYPE.Recommendations },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  INCIDENT: {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_incident_index',
      detail: 'jms_incident_detail'
    },
    taskIcon: 'icons8-breakable-2 incident font16',
    isTaskManagerJob: true,
    menuDetails: incidentMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.Incident, value: eJMSWLTYPE.Incident },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  'NEAR MISS': {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_nearmiss_index',
      detail: 'jms_near_miss_detail'
    },
    taskIcon: 'icons8-demolition-excavator-2 near-miss font16',
    isTaskManagerJob: true,
    menuDetails: nearMissMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.NearMiss, value: eJMSWLTYPE.NearMiss },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  'OFFICE TASK': {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_office_task_index',
      detail: 'jms_ot_detail'
    },
    taskIcon: 'icons8-task-planning-2 office-task font16',
    menuDetails: officeTaskMenu,
    childLinkTypes: [{ label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask }]
  },
  CAR: {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_car_index',
      detail: 'jms_car_detail'
    },
    taskIcon: 'icons8-survey-2 car-rca font16',
    menuDetails: carMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.Car, value: eJMSWLTYPE.Car },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  MOC: {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_moc_index',
      detail: 'jms_moc_detail'
    },
    taskIcon: 'icons8-financial-changes-2 moc font16',
    menuDetails: mocMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.Moc, value: eJMSWLTYPE.Moc },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  'DAILY WORK PLAN': {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_dwp_index',
      detail: 'jms_dwp_detail'
    },
    taskIcon: '',
    menuDetails: null,
    childLinkTypes: []
  },
  PSC: {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_psc_index',
      detail: 'jms_psc_detail'
    },
    isTaskManagerJob: true,
    taskIcon: 'icons8-worker psc font16',
    menuDetails: pscMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.Psc.toLocaleUpperCase(), value: eJMSWLTYPE.Psc },
      { label: eJMSWorklistType.Deficiency, value: eJMSWLTYPE.Deficiency }
    ]
  },
  'ROUTINE SCM': {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_scm_index',
      detail: 'jms_scm_detail'
    },
    taskIcon: 'icons8-meeting-room-2 scm font16',
    menuDetails: scmMenu,
    childLinkTypes: []
  },
  'VESSEL TASK': {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_vessel_task_index',
      detail: 'jms_vessel_task_detail'
    },
    taskIcon: 'icons8-administrative-tools-2 vessel-task font16',
    isTaskManagerJob: true,
    menuDetails: vesselTaskMenu,
    childLinkTypes: [{ label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }]
  },
  DEFICIENCY: {
    moduleCode: 'jms',
    functionCode: {
      index: 'jms_deficiency_index',
      detail: 'jms_deficiency_detail'
    },
    isTaskManagerJob: true,
    taskIcon: 'icons8-wolfram-alpha deficiency font16',
    menuDetails: deficiencyMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.Deficiency, value: eJMSWLTYPE.Deficiency },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  },
  'INTERNAL AUDIT': {
    moduleCode: 'tm_internal_audit',
    functionCode: {
      index: 'tm_internal_audit_index',
      detail: 'tm_internal_audit_detail',
      plannerIndex: 'tm_internal_audit_planner_index'
    },
    taskIcon: 'icons8-pass-fail-2 int-audit font16',
    isTaskManagerJob: true,
    menuDetails: internalAuditMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.InternalAudit, value: eJMSWLTYPE.InternalAudit },
      { label: 'Non-Conformity', value: eJMSWLTYPE.NonPMNCR },
      { label: 'Recommendations', value: eJMSWLTYPE.Recommendations }
    ]
  },
  CERTIFICATE: {
    moduleCode: 'tm_certificate',
    functionCode: {
      index: 'tm_certificate_index',
      detail: 'tm_certificate_detail'
    },
    taskIcon: 'icons8-certificate certificate font16',
    isTaskManagerJob: true,
    menuDetails: certificateMenu,
    childLinkTypes: [{ label: 'Certificate', value: eJMSWLTYPE.Certificates }]
  },
  'UNSAFE ACT/CONDITION': {
    moduleCode: 'tm_besafe',
    functionCode: {
      index: 'tm_besafe_index',
      detail: 'tm_besafe_detail'
    },
    taskIcon: 'icons8-stop-2 beSafe',
    isTaskManagerJob: true,
    menuDetails: beSafeMenu,
    childLinkTypes: [{ label: eJMSWorklistType.BeSafe, value: eJMSWLTYPE.BeSafe }]
  },
  'INTERNAL INSPECTION': {
    moduleCode: 'tm_inspection_internal',
    functionCode: {
      index: 'tm_inspection_internal_index',
      detail: 'tm_inspection_internal_detail'
    },
    taskIcon: 'icons8-pass-fail-2 int-audit font16',
    isTaskManagerJob: true,
    menuDetails: internalInspectionMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.InternalAudit, value: eJMSWLTYPE.InternalAudit },
      { label: 'Non-Conformity', value: eJMSWLTYPE.NonPMNCR },
      { label: 'Recommendations', value: eJMSWLTYPE.Recommendations }
    ],
    menuLink: 'inspection'
  },
  'EXTERNAL INSPECTION': {
    moduleCode: 'tm_inspection_external',
    functionCode: {
      index: 'tm_inspection_external_index',
      detail: 'tm_inspection_external_detail'
    },
    taskIcon: 'icons8-pass-fail-2 int-audit font16',
    isTaskManagerJob: true,
    menuDetails: externalInspectionMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.InternalAudit, value: eJMSWLTYPE.InternalAudit },
      { label: 'Non-Conformity', value: eJMSWLTYPE.NonPMNCR },
      { label: 'Recommendations', value: eJMSWLTYPE.Recommendations }
    ],
    menuLink: 'inspection'
  },
  'ONBOARD INSPECTION': {
    moduleCode: 'tm_inspection_onboard',
    functionCode: {
      index: 'tm_inspection_onboard_index',
      detail: 'tm_inspection_onboard_detail'
    },
    taskIcon: 'icons8-pass-fail-2 int-audit font16',
    isTaskManagerJob: true,
    menuDetails: onboardInspectionMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.InternalAudit, value: eJMSWLTYPE.InternalAudit },
      { label: 'Non-Conformity', value: eJMSWLTYPE.NonPMNCR },
      { label: 'Recommendations', value: eJMSWLTYPE.Recommendations }
    ],
    menuLink: 'inspection'
  },
  'VETTING INSPECTION': {
    moduleCode: 'tm_inspection_vetting',
    functionCode: {
      index: 'tm_inspection_vetting_index',
      detail: 'tm_inspection_vetting_detail'
    },
    taskIcon: 'icons8-what-i-do vetting-inspection font16',
    isTaskManagerJob: true,
    menuDetails: onboardInspectionMenu,
    childLinkTypes: [
      { label: eJMSWorklistType.VettingInspection, value: eJMSWLTYPE.VettingInspection },
      { label: 'Non-Conformity', value: eJMSWLTYPE.NonPMNCR },
      { label: 'Recommendations', value: eJMSWLTYPE.Recommendations }
    ],
    menuLink: 'inspection'
  },
  'VETTING OBSERVATION': {
    moduleCode: 'tm_inspection_vetting_observation',
    functionCode: {
      detail: 'tm_inspection_vetting_observation_detail'
    },
    taskIcon: 'icons8-advanced-search vetting-observation font16',
    isTaskManagerJob: true,
    menuLink: 'inspection',
    childLinkTypes: [
      { label: eJMSWorklistType.VettingObservation, value: eJMSWLTYPE.VettingObservation },
      { label: eJMSWorklistType.OfficeTask, value: eJMSWLTYPE.OfficeTask },
      { label: eJMSWorklistType.VesselTask, value: eJMSWLTYPE.VesselTask }
    ]
  }
};

export const tmLinkedRecordsGridColumns: Column[] = [
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Code,
    FieldName: TmLinkedRecordsFieldNames.Code,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Type,
    FieldName: TmLinkedRecordsFieldNames.TaskType,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Subject,
    FieldName: TmLinkedRecordsFieldNames.Subject,
    width: '250px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.AssignedTo,
    FieldName: TmLinkedRecordsFieldNames.AssignedTo,
    width: '150px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Date,
    FieldName: TmLinkedRecordsFieldNames.Date,
    ControlType: eFieldControlType.Date,
    FieldType: eFieldControlType.Date,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.DueDate,
    FieldName: TmLinkedRecordsFieldNames.DueDate,
    ControlType: eFieldControlType.Date,
    FieldType: eFieldControlType.Date,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Status,
    FieldName: TmLinkedRecordsFieldNames.Status,
    width: '100px'
  }
];

export const tmLinkedRecordsChildGridColumns: Column[] = [
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Code,
    FieldName: 'Code',
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Type,
    FieldName: TmLinkedRecordsFieldNames.TaskType,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Subject,
    FieldName: 'Title',
    width: '250px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.AssignedTo,
    FieldName: 'Assigned_To',
    width: '150px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Date,
    FieldName: 'created_date',
    ControlType: eFieldControlType.Date,
    FieldType: eFieldControlType.Date,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.DueDate,
    FieldName: 'Due_Date',
    ControlType: eFieldControlType.Date,
    FieldType: eFieldControlType.Date,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Status,
    FieldName: 'Job_Status',
    width: '100px'
  }
];

export const tmLinkedRecordsPopupColumns: Column[] = [
  {
    IsActive: true,
    IsVisible: true,
    Editable: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Selected,
    FieldName: TmLinkedRecordsFieldNames.Selected,
    FieldType: eFieldControlType.Checkbox,
    ControlType: eFieldControlType.Checkbox,
    width: '50px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Code,
    FieldName: TmLinkedRecordsFieldNames.Code,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Type,
    FieldName: TmLinkedRecordsFieldNames.TaskType,
    width: '100px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Subject,
    FieldName: TmLinkedRecordsFieldNames.Subject,
    width: '200px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.AssignedTo,
    FieldName: TmLinkedRecordsFieldNames.AssignedTo,
    width: '150px'
  },
  {
    IsActive: true,
    IsVisible: true,
    IsMandatory: true,
    DisplayText: TmLinkedRecordsDisplayNames.Status,
    FieldName: TmLinkedRecordsFieldNames.Status,
    width: '100px'
  }
];
export const tmLinkedRecordsFilters = [
  {
    ValueCode: TmLinkedRecordsFieldNames.TaskType,
    DisplayText: TmLinkedRecordsDisplayNames.TaskType,
    DisplayCode: TmLinkedRecordsFieldNames.TaskType,
    FieldName: TmLinkedRecordsFieldNames.TaskType,
    Active_Status: true,
    FieldID: 1,
    ControlType: 'simple',
    gridName: TmLinkedRecordsGridName.linkedRecordsPopupGridName,
    default: true
  },
  {
    ValueCode: TmLinkedRecordsFieldNames.Status,
    DisplayText: TmLinkedRecordsDisplayNames.taskStatus,
    DisplayCode: TmLinkedRecordsFieldNames.Status,
    FieldName: TmLinkedRecordsFieldNames.Status,
    Active_Status: true,
    FieldID: 2,
    ControlType: 'simple',
    gridName: TmLinkedRecordsGridName.linkedRecordsPopupGridName,
    default: true
  },
  {
    ValueCode: TmLinkedRecordsFieldNames.AssignedTo,
    DisplayText: TmLinkedRecordsDisplayNames.AssignedTo,
    DisplayCode: TmLinkedRecordsFieldNames.AssignedToFullName,
    FieldName: TmLinkedRecordsFieldNames.AssignedTo,
    Active_Status: true,
    FieldID: 3,
    ControlType: 'simple',
    gridName: TmLinkedRecordsGridName.linkedRecordsPopupGridName,
    default: true
  }
];
