import { Component, OnInit, ViewChild } from '@angular/core';
import { eGridRowActions, GridAction, GridComponent } from 'jibe-components';
import { GridInputsWithRequest } from '../../../models/interfaces/grid-inputs';
import { IStatementOfFactDto } from './dtos/IStatementOfFactDto';
import { StatementOfFactsGridService } from './StatementOfFactsGridService';
import { StatementOfFactsGridOdataKeys } from '../../../models/enums/StatementOfFactsGridOdataKeys';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jb-statement-of-facts',
  templateUrl: './statement-of-facts.component.html',
  styleUrls: ['./statement-of-facts.component.scss'],
  providers: [StatementOfFactsGridService]
})
export class StatementOfFactsComponent implements OnInit {
  @ViewChild('statementOfFactsGrid')
  statementOfFactsGrid: GridComponent;

  public gridInputs: GridInputsWithRequest;

  private projectUid: string;

  constructor(
    private statementOfFactsGridService: StatementOfFactsGridService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectUid = this.route.snapshot.paramMap.get('projectUid');
    this.setGridInputs();
  }

  public onGridAction({ type }: GridAction<string, string>, project: IStatementOfFactDto): void {
    if (type === eGridRowActions.Delete) {
      // this.deleteProjectFormGroup.value.Project = project;
      this.showDeleteDialog();
    } else if (type === eGridRowActions.Edit) {
      if (!project) {
        throw new Error('Project is null');
      }
    } else if (type === this.gridInputs.gridButton.label) {
      this.showCreateNewDialog();
    }
  }

  public showCreateNewDialog() {
    // TODO: implement
  }

  public showDeleteDialog() {
    // TODO: implement
  }

  onMatrixRequestChanged() {
    this.statementOfFactsGrid.odata.filter.eq(StatementOfFactsGridOdataKeys.ProjectUid, this.projectUid);
  }

  private setGridInputs() {
    this.gridInputs = this.statementOfFactsGridService.getGridInputs();
    this.setGridActions();
  }

  private setGridActions() {
    this.gridInputs.actions.length = 0;

    this.gridInputs.actions.push({
      name: eGridRowActions.Edit,
      label: 'Edit'
    });

    this.gridInputs.actions.push({
      name: eGridRowActions.Delete,
      label: 'Delete'
    });
  }
}
