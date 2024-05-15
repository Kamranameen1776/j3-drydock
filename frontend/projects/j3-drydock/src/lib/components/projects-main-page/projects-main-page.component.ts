import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { PROJECTS_MAIN_TITLE } from '../../models/constants/constants';

@Component({
  selector: 'jb-projects-main-page',
  templateUrl: './projects-main-page.component.html',
  styleUrls: ['./projects-main-page.component.scss']
})
export class ProjectsMainPageComponent implements OnInit {
  constructor(private title: Title) {}

  ngOnInit(): void {
    this.title.setTitle(PROJECTS_MAIN_TITLE);
  }
}
