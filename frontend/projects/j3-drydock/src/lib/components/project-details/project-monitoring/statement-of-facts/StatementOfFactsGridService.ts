import { Injectable } from '@angular/core';
import { Column, GridButton, GridRowActions, UserService, eGridColumnsWidth, FormModel, eFieldControlType } from 'jibe-components';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { nameOf } from '../../../../utils/nameOf';
import { StatementOfFactsService } from '../../../../services/project-monitoring/statement-of-facts/StatementOfFactsService';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import {
  eStatementOfFactsDeleteDisplayNames,
  eStatementOfFactsDeleteFieldNames
} from '../../../../models/enums/statement-of-fact-delete.enum';

@Injectable()
export class StatementOfFactsGridService {
  public readonly gridName: string = 'statementOfFactsGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  public readonly dateTimeFormat = `${this.dateFormat} HH:MM`;

  public readonly createStatementOfFactFormId = 'statementOfFactCreate';

  public readonly deleteStatementOfFactFormId = 'statementOfFactDelete';

  private readonly columns: Column[] = [
    {
      DisplayText: 'StatementOfFactsUid',
      FieldName: nameOf<IStatementOfFactDto>((prop) => prop.StatementOfFactsUid),
      IsActive: true,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'Fact',
      FieldName: nameOf<IStatementOfFactDto>((prop) => prop.Fact),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
    },
    {
      DisplayText: 'Date & Time',
      FieldName: nameOf<IStatementOfFactDto>((prop) => prop.DateAndTime),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription,
      pipe: {
        value: 'date',
        format: this.dateTimeFormat
      }
    }
  ];

  private readonly gridButton: GridButton = {
    label: 'Add Fact',
    show: true
  };

  private searchFields: string[] = [nameOf<IStatementOfFactDto>((prop) => prop.Fact)];
  private gridActions: GridRowActions[] = [];

  constructor(
    private userService: UserService,
    private statementOfFactsService: StatementOfFactsService
  ) {}

  public getGridInputs(): GridInputsWithRequest {
    return {
      columns: this.columns,
      gridName: this.gridName,
      searchFields: this.searchFields,
      request: this.statementOfFactsService.getStatementOfFactsRequest(),
      gridButton: this.gridButton,
      actions: this.gridActions,
      sortField: nameOf<IStatementOfFactDto>((prop) => prop.DateAndTime),
      sortOrder: -1,
      name: 'Statement of Facts'
    };
  }

  public getDeleteStatementOfFactForm(): FormModel {
    return {
      id: 'deleteStatementOfFact',
      label: '',
      type: 'form',
      sections: {
        [this.deleteStatementOfFactFormId]: {
          type: 'grid',
          label: '',
          formID: this.deleteStatementOfFactFormId,
          gridRowStart: 1,
          gridRowEnd: 1,
          gridColStart: 1,
          gridColEnd: 1,
          fields: {
            [eStatementOfFactsDeleteFieldNames.AreYouSureYouWantToDeleteThisStatementOfFact]: {
              label: eStatementOfFactsDeleteDisplayNames.AreYouSureYouWantToDeleteThisStatementOfFact,
              type: eFieldControlType.String,
              sectionID: this.deleteStatementOfFactFormId,
              gridRowStart: 1,
              gridRowEnd: 1,
              gridColStart: 1,
              gridColEnd: 1
            }
          }
        }
      }
    };
  }
}
