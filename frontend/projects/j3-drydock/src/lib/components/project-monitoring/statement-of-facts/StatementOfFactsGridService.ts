import { Injectable } from '@angular/core';
import {
  Column,
  Filter,
  FilterListSet,
  GridButton,
  GridRowActions,
  UserService,
  eGridColumnsWidth,
  eFieldControlType,
  FormModel,
  SystemLevelFiltersService,
  Datasource
} from 'jibe-components';
import { nameOf } from '../../../utils/nameOf';
import { ProjectsService } from '../../../services/ProjectsService';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { eProjectsCreateDisplayNames, eProjectsCreateFieldNames } from '../../../models/enums/projects-create.enum';
import { eProjectsDeleteDisplayNames, eProjectsDeleteFieldNames } from '../../../models/enums/projects-delete.enum';
import { ProjectsGridOdataKeys } from '../../../models/enums/ProjectsGridOdataKeys';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { StatementOfFactsService } from '../../../services/project-monitoring/statement-of-facts/StatementOfFactsService';

@Injectable()
export class StatementOfFactsGridService {
  public readonly gridName: string = 'statementOfFactsGrid';

  public readonly dateFormat = this.userService.getUserDetails().Date_Format;

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
      DisplayText: 'Date & time',
      FieldName: nameOf<IStatementOfFactDto>((prop) => prop.DateAndTime),
      IsActive: true,
      IsMandatory: true,
      IsVisible: true,
      ReadOnly: true,
      width: eGridColumnsWidth.ShortDescription
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
      // TODO: get project uid from the route
      request: this.statementOfFactsService.getStatementOfFactsRequest('123'),
      gridButton: this.gridButton,
      actions: this.gridActions
    };
  }
}
