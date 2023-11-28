import { Injectable } from '@angular/core';
import { Column, GridButton, GridRowActions, UserService, eGridColumnsWidth, SystemLevelFiltersService } from 'jibe-components';
import { nameOf } from '../../../utils/nameOf';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { StatementOfFactsService } from '../../../services/project-monitoring/statement-of-facts/StatementOfFactsService';

@Injectable()
export class StatementOfFactsGridService {
  public readonly gridName: string = 'statementOfFactsGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format.toLocaleUpperCase();

  public readonly dateTimeFormat = `${this.dateFormat} HH:MM`;

  initDate: Date = new Date();

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

  public createStatementOfFactFormId = 'statementOfFactCreate';

  public deleteStatementOfFactFormId = 'statementOfFactDelete';

  constructor(
    private userService: UserService,
    private statementOfFactsService: StatementOfFactsService,
    private slfService: SystemLevelFiltersService
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
      name: 'Statement of Facts',
    };
  }
}
