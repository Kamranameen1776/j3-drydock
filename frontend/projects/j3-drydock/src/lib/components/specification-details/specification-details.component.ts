import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SpecificationDetailsService } from '../../services/specification-details/specification-details.service';
import { GetSpecificationDetailsDto } from '../../models/dto/specification-details/GetSpecificationDetailsDto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss']
})
export class SpecificationDetailsComponent implements OnInit {
  private pageTitle = 'Specification Details';
  public specificationDetails: GetSpecificationDetailsDto;
  public specificationUid: string;

  constructor(
    private title: Title,
    private specificatioDetailService: SpecificationDetailsService,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const { snapshot } = this.activatedRoute;
    this.specificationUid = snapshot.params['specificationUid'];
    this.specificationDetails = await this.specificatioDetailService.getSpecificationDetails(this.specificationUid).toPromise();
    this.pageTitle = `Specification ${this.specificationDetails.SpecificationCode}`;
    this.title.setTitle(this.pageTitle);
  }
}
