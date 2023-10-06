import { StandardJobsService } from '../../services/StandardJobsService';
import { Injectable } from '@angular/core';
import { Column, GridButton } from 'jibe-components';
import { nameOf } from '../../utils/nameOf';
import { eStandardJobsMainLabels } from '../../models/enums/standard-jobs-main.enum';
import { StandardJobResult } from '../../models/interfaces/standard-jobs';
import { GridInputsWithRequest } from '../../models/interfaces/grid-inputs';

@Injectable()
export class StandardJobsGridService {
  public readonly gridName: string = 'standardJobsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.ItemNumber,
      FieldName: nameOf<StandardJobResult>((prop) => prop.ItemNumber),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Subject,
      FieldName: nameOf<StandardJobResult>((prop) => prop.Subject),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.VesselType,
      FieldName: nameOf<StandardJobResult>((prop) => prop.VesselType),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.ItemCategory,
      FieldName: nameOf<StandardJobResult>((prop) => prop.ItemCategory),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Inspection,
      FieldName: nameOf<StandardJobResult>((prop) => prop.Inspection),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.DoneBy,
      FieldName: nameOf<StandardJobResult>((prop) => prop.DoneBy),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.MaterialSuppliedBy,
      FieldName: nameOf<StandardJobResult>((prop) => prop.MaterialSuppliedBy),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    }
  ];

  private readonly gridButton: GridButton = {
    label: eStandardJobsMainLabels.createNewJob,
    show: true
  };

  constructor(private standardJobsService: StandardJobsService) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      request: this.standardJobsService.getStandardJobsRequest(),
      gridButton: this.gridButton
    };
  }
}
