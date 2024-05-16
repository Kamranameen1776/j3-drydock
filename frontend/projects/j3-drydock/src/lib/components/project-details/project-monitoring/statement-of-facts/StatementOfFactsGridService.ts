import { Injectable } from '@angular/core';
import { Column, GridRowActions, UserService, eGridColumnsWidth, FormModel, eFieldControlType } from 'jibe-components';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { nameOf } from '../../../../utils/nameOf';
import { StatementOfFactsService } from '../../../../services/project-monitoring/statement-of-facts/StatementOfFactsService';
import { GridInputsWithRequest } from '../../../../models/interfaces/grid-inputs';
import {
  eStatementOfFactsCreateDisplayNames,
  eStatementOfFactsCreateFieldNames
} from '../../../../models/enums/statement-of-fact-create.enum';
import {
  eStatementOfFactsUpdateFieldNames,
  eStatementOfFactsUpdateDisplayNames
} from '../../../../models/enums/statement-of-fact-update.enum';

@Injectable()
export class StatementOfFactsGridService {
  public readonly gridName: string = 'statementOfFactsGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  public readonly dateTimeFormat = `${this.dateFormat} HH:mm`;

  public readonly createStatementOfFactFormId = 'statementOfFactCreate';

  public readonly updateStatementOfFactFormId = 'statementOfFactUpdate';

  private readonly columns: Column[] = [
    {
      DisplayText: 'StatementOfFactsUid',
      FieldName: nameOf<IStatementOfFactDto>((prop) => prop.StatementOfFactsUid),
      IsActive: false,
      IsMandatory: true,
      IsVisible: false,
      ReadOnly: true
    },
    {
      DisplayText: 'Date & Time',
      FieldName: nameOf<IStatementOfFactDto>((prop) => prop.DateAndTime),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.LongDescription
    },
    {
      DisplayText: 'Fact',
      FieldName: nameOf<IStatementOfFactDto>((prop) => prop.Fact),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true
    }
  ];

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
      actions: this.gridActions,
      sortField: nameOf<IStatementOfFactDto>((prop) => prop.DateAndTime),
      sortOrder: -1,
      name: 'Statement of Facts'
    };
  }

  public getCreateStatementOfFactForm(): FormModel {
    return {
      id: this.createStatementOfFactFormId,
      label: '',
      type: 'form',
      sections: {
        [this.createStatementOfFactFormId]: {
          type: 'grid',
          label: '',
          formID: this.createStatementOfFactFormId,
          gridRowStart: 1,
          gridRowEnd: 14,
          gridColStart: 1,
          gridColEnd: 1,
          fields: {
            [eStatementOfFactsCreateFieldNames.Fact]: {
              label: eStatementOfFactsCreateDisplayNames.Fact,
              type: eFieldControlType.Text,
              sectionID: this.createStatementOfFactFormId,
              enabled: true,
              minLength: 1,
              maxLength: 350,
              validatorRequired: true,
              gridRowStart: 4,
              gridRowEnd: 5,
              gridColStart: 1,
              gridColEnd: 3
            },

            [eStatementOfFactsCreateFieldNames.DateTime]: {
              label: eStatementOfFactsCreateDisplayNames.DateTime,
              type: eFieldControlType.DateTime,
              sectionID: this.createStatementOfFactFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 6,
              gridRowEnd: 7,
              gridColStart: 1,
              gridColEnd: 3
            }
          }
        }
      }
    };
  }

  public getUpdateStatementOfFactForm(): FormModel {
    return {
      id: this.updateStatementOfFactFormId,
      label: '',
      type: 'form',
      sections: {
        [this.updateStatementOfFactFormId]: {
          type: 'grid',
          label: '',
          formID: this.updateStatementOfFactFormId,
          gridRowStart: 1,
          gridRowEnd: 14,
          gridColStart: 1,
          gridColEnd: 1,
          fields: {
            [eStatementOfFactsUpdateFieldNames.StatementOfFactUid]: {
              label: eStatementOfFactsUpdateDisplayNames.StatementOfFactUid,
              type: eFieldControlType.String,
              sectionID: this.updateStatementOfFactFormId,
              enabled: true,
              show: 'hidden',
              gridRowStart: 4,
              gridRowEnd: 5,
              gridColStart: 1,
              gridColEnd: 3
            },

            [eStatementOfFactsUpdateFieldNames.Fact]: {
              label: eStatementOfFactsUpdateDisplayNames.Fact,
              type: eFieldControlType.Text,
              sectionID: this.updateStatementOfFactFormId,
              enabled: true,
              minLength: 1,
              maxLength: 350,
              validatorRequired: true,
              gridRowStart: 4,
              gridRowEnd: 5,
              gridColStart: 1,
              gridColEnd: 3
            },

            [eStatementOfFactsUpdateFieldNames.DateTime]: {
              label: eStatementOfFactsUpdateDisplayNames.DateTime,
              type: eFieldControlType.DateTime,
              sectionID: this.updateStatementOfFactFormId,
              enabled: true,
              validatorRequired: true,
              gridRowStart: 6,
              gridRowEnd: 7,
              gridColStart: 1,
              gridColEnd: 3
            }
          }
        }
      }
    };
  }
}
