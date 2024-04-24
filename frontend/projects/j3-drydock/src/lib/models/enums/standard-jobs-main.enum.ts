export enum eStandardJobsMainLabels {
  CreateNewJob = 'Create New',
  CreateNewStandardJob = 'Create New Standard Job',
  AddSubItem = 'Add Sub Item',
  Status = 'Status',

  ItemNumber = 'Item No.',
  Code = 'Item Number',
  Subject = 'Subject',
  VesselType = 'Vessel Type',
  ItemCategory = 'Item Category',
  Inspection = 'Inspection / Survey',
  DoneBy = 'Done By',
  MaterialSuppliedBy = 'Material Supplied By',
  Function = 'Function',
  VesselSpecific = 'Vessel Type Specific',
  Description = 'Description',
  Scope = 'Scope',
  HasSubItems = 'Sub Items',
  HasInspection = 'Inspection / Survey',

  EstimatedDuration = 'Estimated Duration [Days]',
  BufferTime = 'Buffer Time',
  GLAccount = 'GL Account',
  EstimatedBudget = 'Estimated Budget',
  JobExecution = 'Job Execution',
  JobRequired = 'Job Required'
}

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
  Code = 'code',

  Function = 'function',
  FunctionUid = 'functionUid',
  ItemCategoryID = 'categoryUid',
  MaterialSuppliedByID = 'materialSuppliedByUid',
  DoneByID = 'doneByUid',
  VesselTypeID = 'vesselTypeId',
  Description = 'description',
  InspectionID = 'inspectionId',
  Scope = 'scope',
  SubItems = 'subItems',
  HasSubItems = 'hasSubItems',
  HasInspection = 'hasInspection',

  EstimatedDuration = 'duration',
  BufferTime = 'bufferTime',
  GLAccount = 'glAccountUid',
  EstimatedBudget = 'estimatedBudget',
  JobExecution = 'jobExecutionUid',
  JobRequired = 'jobRequired'
}

export enum eStandardJobsMainStatus {
  Active = 'Active',
  InActive = 'In Active'
}
