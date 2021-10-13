import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProjects } from '../projects.model';

@Component({
  selector: 'jhi-projects-detail',
  templateUrl: './projects-detail.component.html',
})
export class ProjectsDetailComponent implements OnInit {
  projects: IProjects | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projects }) => {
      this.projects = projects;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
