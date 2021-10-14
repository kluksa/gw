import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProjects } from '../projects.model';
import { ProjectsService } from '../service/projects.service';

@Component({
  templateUrl: './projects-delete-dialog.component.html',
})
export class ProjectsDeleteDialogComponent {
  projects?: IProjects;

  constructor(protected projectsService: ProjectsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
