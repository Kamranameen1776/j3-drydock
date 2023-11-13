import { eSpecificationDetailsPageMenuIds } from '../../../models/enums/specification-details-menu-items.enum';

const specificationDetailSections: eSpecificationDetailsPageMenuIds[] = [
  eSpecificationDetailsPageMenuIds.GeneralInformation,
  eSpecificationDetailsPageMenuIds.SubItems,
  eSpecificationDetailsPageMenuIds.PMSJobs,
  eSpecificationDetailsPageMenuIds.Contacts,
  eSpecificationDetailsPageMenuIds.Tasks,
  eSpecificationDetailsPageMenuIds.Requisition,
  eSpecificationDetailsPageMenuIds.Spares,
  eSpecificationDetailsPageMenuIds.Source,
  eSpecificationDetailsPageMenuIds.SpecificationAttachments
];

const views = Object.values(eSpecificationDetailsPageMenuIds);
const sections = [...specificationDetailSections] as const;

export const sectionViewMap: Record<Section, View> = {
  [eSpecificationDetailsPageMenuIds.SpecificationDetails]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.GeneralInformation]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.SubItems]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.PMSJobs]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.Contacts]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.Tasks]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.Requisition]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.Spares]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.Source]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.SpecificationAttachments]: eSpecificationDetailsPageMenuIds.SpecificationDetails,
  [eSpecificationDetailsPageMenuIds.Attachments]: eSpecificationDetailsPageMenuIds.Attachments,
  [eSpecificationDetailsPageMenuIds.AuditTrail]: eSpecificationDetailsPageMenuIds.AuditTrail
};

export type Section = (typeof sections)[number];
export type View = (typeof views)[number];

export type SectionEditMode = Record<Section, boolean>;

export const defaultSectionEditMode = sections.reduce((accum, key) => ({ ...accum, [key]: false }), {} as SectionEditMode);
export interface ISpecificationFormGroup {
  uid: string;
  title: string;
  assigneeUid?: string;
}
