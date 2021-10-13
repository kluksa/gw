import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProjectAllocation } from '../project-allocation.model';

@Component({
  selector: 'jhi-project-allocation-detail',
  templateUrl: './project-allocation-detail.component.html',
})
export class ProjectAllocationDetailComponent implements OnInit {
  projectAllocation: IProjectAllocation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectAllocation }) => {
      this.projectAllocation = projectAllocation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
