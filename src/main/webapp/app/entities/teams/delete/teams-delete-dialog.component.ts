import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeams } from '../teams.model';
import { TeamsService } from '../service/teams.service';

@Component({
  templateUrl: './teams-delete-dialog.component.html',
})
export class TeamsDeleteDialogComponent {
  teams?: ITeams;

  constructor(protected teamsService: TeamsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.teamsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
