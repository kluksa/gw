import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeamAllocation } from '../team-allocation.model';
import { TeamAllocationService } from '../service/team-allocation.service';

@Component({
  templateUrl: './team-allocation-delete-dialog.component.html',
})
export class TeamAllocationDeleteDialogComponent {
  teamAllocation?: ITeamAllocation;

  constructor(protected teamAllocationService: TeamAllocationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teamAllocationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
