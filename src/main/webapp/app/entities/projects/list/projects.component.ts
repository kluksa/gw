import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProjects } from '../projects.model';
import { ProjectsService } from '../service/projects.service';
import { ProjectsDeleteDialogComponent } from '../delete/projects-delete-dialog.component';

@Component({
  selector: 'jhi-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  projects?: IProjects[];
  isLoading = false;

  constructor(protected projectsService: ProjectsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.projectsService.query().subscribe(
      (res: HttpResponse<IProjects[]>) => {
        this.isLoading = false;
        this.projects = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProjects): number {
    return item.id!;
  }

  delete(projects: IProjects): void {
    const modalRef = this.modalService.open(ProjectsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.projects = projects;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
