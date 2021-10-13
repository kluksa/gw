import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProjectAllocation } from '../project-allocation.model';
import { ProjectAllocationService } from '../service/project-allocation.service';

@Component({
  templateUrl: './project-allocation-delete-dialog.component.html',
})
export class ProjectAllocationDeleteDialogComponent {
  projectAllocation?: IProjectAllocation;

  constructor(protected projectAllocationService: ProjectAllocationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectAllocationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
