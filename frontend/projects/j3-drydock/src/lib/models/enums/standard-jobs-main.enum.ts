export enum eStandardJobsMainLabels {
  CreateNewJob = 'Create New Job',
  CreateNewStandardJob = 'Create New Standard Job',
  AddSubItem = 'Add Sub Item',
  Status = 'Status',

  ItemNumber = 'Item No.',
  Subject = 'Subject',
  VesselType = 'Vessel Type',
  ItemCategory = 'Item Category',
  Inspection = 'Inspection / Survey',
  DoneBy = 'Done By',
  MaterialSuppliedBy = 'Material Supplied By',
  Function = 'Function',
  VesselSpecific = 'Vessel Type Specific',
  Description = 'Description',
  Scope = 'Scope'
}
// TODO fixme capital when api ready
export enum eStandardJobsMainFields {
  ItemNumber = 'code',
  Subject = 'subject',
  VesselType = 'vesselType',
  ItemCategory = 'category',
  Inspection = 'inspection',
  DoneBy = 'doneBy',
  MaterialSuppliedBy = 'materialSuppliedBy',
  VesselSpecific = 'vesselTypeSpecific',
  UID = 'uid',

  Function = 'function',
  ItemCategoryID = 'categoryUid',
  MaterialSuppliedByID = 'materialSuppliedByUid',
  DoneByID = 'doneByUid',
  VesselTypeID = 'vesselTypeId',
  Description = 'description',
  InspectionID = 'inspection',
  Scope = 'Scope'
}

export enum eStandardJobsMainStatus {
  Active = 'Active',
  InActive = 'In Active'
}
