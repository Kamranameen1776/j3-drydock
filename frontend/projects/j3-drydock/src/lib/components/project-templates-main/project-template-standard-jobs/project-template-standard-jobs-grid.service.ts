import { Injectable } from '@angular/core';
import { Column, GridButton } from 'jibe-components';
import { GridInputsWithData } from '../../../models/interfaces/grid-inputs';

export enum eProjectTemplateStandardJobsFields {
  ItemNumber = 'ItemNumber',
  Subject = 'Subject',
  VesselType = 'VesselType',
  Inspection = 'InspectionSurvey',
  DoneBy = 'DoneBy'
}

export enum eProjectTemplateStandardJobsLabels {
  ItemNumber = 'Item No',
  Subject = 'Subject',
  VesselType = 'Vessel Type',
  Inspection = 'Inspection / Survey',
  DoneBy = 'Done By',

  AddButton = 'Add Standard Job'
}

export interface ProjectTemplateStandardJob {
  ProjectTemplateUid: string;
  StandardJobUid: string;
  ItemNumber: string;
  Subject: string;
  VesselType: string;
  VesselTypeId: number[];
  InspectionSurvey: string;
  InspectionSurveyId: number[];
  DoneBy: string;
  DoneByUid: string;
  MaterialSuppliedBy: string;
  MaterialSuppliedByUid: string;
}

@Injectable()
export class ProjectTemplateStandardJobsGridService {
  readonly gridName: string = 'projectTemplateStandardJobsGrid';

  private readonly columns: Column[] = [
    {
      DisplayText: eProjectTemplateStandardJobsLabels.ItemNumber,
      FieldName: eProjectTemplateStandardJobsFields.ItemNumber,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      width: '100px'
    },
    {
      DisplayText: eProjectTemplateStandardJobsLabels.Subject,
      FieldName: eProjectTemplateStandardJobsFields.Subject,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eProjectTemplateStandardJobsLabels.VesselType,
      FieldName: eProjectTemplateStandardJobsFields.VesselType,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eProjectTemplateStandardJobsLabels.Inspection,
      FieldName: eProjectTemplateStandardJobsFields.Inspection,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisplayText: eProjectTemplateStandardJobsLabels.DoneBy,
      FieldName: eProjectTemplateStandardJobsFields.DoneBy,
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    }
  ];

  private readonly gridButton: GridButton = {
    label: eProjectTemplateStandardJobsLabels.AddButton,
    show: true
  };

  getGridInputs(): GridInputsWithData<ProjectTemplateStandardJob> {
    return {
      columns: this.columns,
      gridName: this.gridName,
      gridButton: this.gridButton
    };
  }
}
