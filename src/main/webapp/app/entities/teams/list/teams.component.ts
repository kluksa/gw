import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeams } from '../teams.model';
import { TeamsService } from '../service/teams.service';
import { TeamsDeleteDialogComponent } from '../delete/teams-delete-dialog.component';

@Component({
  selector: 'jhi-teams',
  templateUrl: './teams.component.html',
})
export class TeamsComponent implements OnInit {
  teams?: ITeams[];
  isLoading = false;

  constructor(protected teamsService: TeamsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.teamsService.query().subscribe(
      (res: HttpResponse<ITeams[]>) => {
        this.isLoading = false;
        this.teams = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITeams): number {
    return item.id!;
  }

  delete(teams: ITeams): void {
    const modalRef = this.modalService.open(TeamsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.teams = teams;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
