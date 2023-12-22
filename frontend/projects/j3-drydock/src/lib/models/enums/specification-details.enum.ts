export enum eSpecificationDetailsPageMenuIds {
  SpecificationDetails = 'specificationDetails',
  GeneralInformation = 'generalInformation',
  SubItems = 'subItems',
  PMSJobs = 'pmsJobs',
  Findings = 'findings',
  Requisitions = 'requisitions',
  Source = 'source',
  SpecificationAttachments = 'specificationAttachments',
  Attachments = 'attachments',
  AuditTrail = 'auditTrail'
}

export enum eSpecificationDetailsPageMenuLabels {
  SpecificationDetails = 'Specification Details',
  GeneralInformation = 'General Information',
  SubItems = 'Sub Items',
  PMSJobs = 'PMS Jobs',
  Findings = 'Findings',
  Requisitions = 'Requisitions',
  Source = 'Source',
  SpecificationAttachments = 'Attachments',
  Attachments = 'Attachments',
  AuditTrail = 'Audit Trail'
}

export const specificationDetailsMenuData = [
  {
    label: eSpecificationDetailsPageMenuLabels.SpecificationDetails,
    id: eSpecificationDetailsPageMenuIds.SpecificationDetails,
    icon: 'icons8-more-details-2',
    isOpen: true,
    items: [
      { label: eSpecificationDetailsPageMenuLabels.GeneralInformation, id: eSpecificationDetailsPageMenuIds.GeneralInformation },
      { label: eSpecificationDetailsPageMenuLabels.SubItems, id: eSpecificationDetailsPageMenuIds.SubItems },
      { label: eSpecificationDetailsPageMenuLabels.PMSJobs, id: eSpecificationDetailsPageMenuIds.PMSJobs },
      { label: eSpecificationDetailsPageMenuLabels.Findings, id: eSpecificationDetailsPageMenuIds.Findings },
      { label: eSpecificationDetailsPageMenuLabels.Requisitions, id: eSpecificationDetailsPageMenuIds.Requisitions },
      { label: eSpecificationDetailsPageMenuLabels.Source, id: eSpecificationDetailsPageMenuIds.Source },
      {
        label: eSpecificationDetailsPageMenuLabels.SpecificationAttachments,
        id: eSpecificationDetailsPageMenuIds.SpecificationAttachments
      }
    ]
  },
  { label: eSpecificationDetailsPageMenuLabels.Attachments, id: eSpecificationDetailsPageMenuIds.Attachments, icon: 'icons8-attach' },
  { label: eSpecificationDetailsPageMenuLabels.AuditTrail, id: eSpecificationDetailsPageMenuIds.AuditTrail, icon: 'icons8-order-history-3' }
];

export enum eSpecificationWorkflowStatusAction {
  Raise = 'RAISE',
  'In Progress' = 'IN PROGRESS',
  Complete = 'COMPLETE',
  Verify = 'VERIFY',
  Review = 'REVIEW',
  Approve = 'APPROVE',
  Close = 'CLOSE',
  Unclose = 'UNCLOSE'
}
