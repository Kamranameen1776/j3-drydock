import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'jb-projects-main-page',
  templateUrl: './projects-main-page.component.html',
  styleUrls: ['./projects-main-page.component.scss']
})
export class ProjectsMainPageComponent implements OnInit {
  private readonly pageTitle = 'Projects Main';

  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(this.pageTitle);
  }
}
