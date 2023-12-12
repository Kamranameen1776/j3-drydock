import { eProjectDetailsSideMenuId, eProjectDetailsSideMenuLabel } from '../../models/enums/project-details.enum';

export const projectDetailsMenuData = [
  {
    label: eProjectDetailsSideMenuLabel.General,
    id: eProjectDetailsSideMenuId.General,
    icon: 'icons8-survey-4',
    isOpen: true
  },
  {
    label: eProjectDetailsSideMenuLabel.Specifications,
    id: eProjectDetailsSideMenuId.Specifications,
    icon: 'icons8-more-details-2',
    items: [
      { label: eProjectDetailsSideMenuLabel.TechnicalSpecification, icon: '', id: 'technical_specification' },
      { label: eProjectDetailsSideMenuLabel.Requisition, id: eProjectDetailsSideMenuId.Requisition },
      { label: eProjectDetailsSideMenuLabel.Contacts, id: eProjectDetailsSideMenuId.Contacts },
      { label: eProjectDetailsSideMenuLabel.Attachments, id: eProjectDetailsSideMenuId.Attachments }
    ]
  },
  {
    label: eProjectDetailsSideMenuLabel.YardSelection,
    id: eProjectDetailsSideMenuId.YardSelection,
    icon: 'icons8-water-transportation',
    items: [
      { label: eProjectDetailsSideMenuLabel.RFQ, id: eProjectDetailsSideMenuId.RFQ },
      { label: eProjectDetailsSideMenuLabel.Comparison, id: eProjectDetailsSideMenuId.Comparison }
    ]
  },
  {
    label: eProjectDetailsSideMenuLabel.ProjectMonitoring,
    id: eProjectDetailsSideMenuId.ProjectMonitoring,
    icon: 'icons8-more-details-2',
    items: [
      { label: eProjectDetailsSideMenuLabel.GanttChart, id: eProjectDetailsSideMenuId.GanttChart },
      { label: eProjectDetailsSideMenuLabel.StatementOfFacts, id: eProjectDetailsSideMenuId.StatementOfFacts },
      { label: eProjectDetailsSideMenuLabel.JobOrders, id: eProjectDetailsSideMenuId.JobOrders },
      { label: eProjectDetailsSideMenuLabel.CostUpdates, id: eProjectDetailsSideMenuId.CostUpdates }
    ]
  },
  {
    label: eProjectDetailsSideMenuLabel.Reporting,
    id: eProjectDetailsSideMenuId.Reporting,
    icon: 'icons8-document-4',
    items: [
      { label: eProjectDetailsSideMenuLabel.DailyReports, id: eProjectDetailsSideMenuId.DailyReports },
      { label: eProjectDetailsSideMenuLabel.ProjectReport, id: eProjectDetailsSideMenuId.ProjectReport },
      { label: eProjectDetailsSideMenuLabel.Evaluations, id: eProjectDetailsSideMenuId.Evaluations }
    ]
  }
];
