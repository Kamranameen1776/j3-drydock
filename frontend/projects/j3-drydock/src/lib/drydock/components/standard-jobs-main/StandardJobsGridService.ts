import { StandardJobsService } from './../../infrastructure-layer/api-services/standard-jobs-main/StandardJobsService';
import { Injectable } from '@angular/core';
import { Column, GridButton } from 'jibe-components';
import { GridInputsWithRequest } from '../../presentation-layer/jb-components-helpers/grid-inputs';
import { nameOf } from '../../common/ts-helpers/nameOf';
import { eStandardJobsMainLabels } from './enums/standard-jobs-main-labels.enum';
import { GetStandardJobsMainResultDto } from '../../infrastructure-layer/api-services/standard-jobs-main/dtos/GetStandardJobsResultDto';

@Injectable()
export class StandardJobsGridService {
  public readonly gridName: string = 'standardJobsGrid';

  private readonly columns: Column[] = [
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.ItemNumber,
      FieldName: nameOf<GetStandardJobsMainResultDto>((prop) => prop.ItemNumber),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      width: '100px'
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Subject,
      FieldName: nameOf<GetStandardJobsMainResultDto>((prop) => prop.Subject),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.VesselType,
      FieldName: nameOf<GetStandardJobsMainResultDto>((prop) => prop.VesselType),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.ItemCategory,
      FieldName: nameOf<GetStandardJobsMainResultDto>((prop) => prop.ItemCategory),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.Inspection,
      FieldName: nameOf<GetStandardJobsMainResultDto>((prop) => prop.Inspection),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.DoneBy,
      FieldName: nameOf<GetStandardJobsMainResultDto>((prop) => prop.DoneBy),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true
    },
    {
      DisableSort: true,
      DisplayText: eStandardJobsMainLabels.MaterialSuppliedBy,
      FieldName: nameOf<GetStandardJobsMainResultDto>((prop) => prop.MaterialSuppliedBy),
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
