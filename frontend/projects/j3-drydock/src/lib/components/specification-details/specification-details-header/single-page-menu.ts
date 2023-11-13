import { IJbMenuItem } from 'jibe-components';
import {
  eSpecificationDetailsPageMenuIds,
  eSpecificationDetailsPageMenuLabels
} from '../../../models/enums/specification-details-menu-items.enum';

export function getListSinglePageMenu(): IJbMenuItem[] {
  return [
    {
      label: eSpecificationDetailsPageMenuLabels.SpecificationDetails,
      icon: 'icons8-bulleted-list',
      id: eSpecificationDetailsPageMenuIds.SpecificationDetails,
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
    { label: eSpecificationDetailsPageMenuLabels.Attachments, icon: 'icons8-attach', id: eSpecificationDetailsPageMenuIds.Attachments },
    { label: eSpecificationDetailsPageMenuLabels.AuditTrail, icon: 'icons8-document-4', id: eSpecificationDetailsPageMenuIds.AuditTrail }
  ];
}
