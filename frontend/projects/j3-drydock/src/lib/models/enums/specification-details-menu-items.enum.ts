export enum eSpecificationDetailsPageMenuIds {
  SpecificationDetails = 'specificationDetails',
  GeneralInformation = 'generalInformation',
  SubItems = 'subItems',
  PMSJobs = 'pmsJobs',
  Contacts = 'contacts',
  Tasks = 'tasks',
  Requisition = 'requisition',
  Spares = 'spares',
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
  Contacts = 'Contacts',
  Tasks = 'Tasks',
  Requisition = 'Requisition',
  Spares = 'Spares',
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
      { label: eSpecificationDetailsPageMenuLabels.Contacts, id: eSpecificationDetailsPageMenuIds.Contacts },
      { label: eSpecificationDetailsPageMenuLabels.Tasks, id: eSpecificationDetailsPageMenuIds.Tasks },
      { label: eSpecificationDetailsPageMenuLabels.Requisition, id: eSpecificationDetailsPageMenuIds.Requisition },
      { label: eSpecificationDetailsPageMenuLabels.Spares, id: eSpecificationDetailsPageMenuIds.Spares },
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
