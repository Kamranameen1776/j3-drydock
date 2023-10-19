import { Component, OnInit } from '@angular/core';
import { UnsubscribeComponent } from '../../shared/classes/unsubscribe.base';
import { SpecificationTopDetailsService, TopFieldsData } from '../../services/specifications/specification-top-details.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'jb-project-header',
  templateUrl: './project-header.component.html',
  styleUrls: ['./project-header.component.scss']
})
export class ProjectHeaderComponent extends UnsubscribeComponent implements OnInit {
  topDetailsData: TopFieldsData;

  constructor(private specsTopDetailsService: SpecificationTopDetailsService) {
    super();
  }

  ngOnInit(): void {
    this.specsTopDetailsService
      .getTopDetailsData()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.topDetailsData = data;
      });
  }
}
