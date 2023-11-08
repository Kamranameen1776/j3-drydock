import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jb-specification-details',
  templateUrl: './specification-details.component.html',
  styleUrls: ['./specification-details.component.scss']
})
export class SpecificationDetailsComponent implements OnInit {
  private readonly pageTitle = 'Specification Details';

  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(this.pageTitle);
  }
}
