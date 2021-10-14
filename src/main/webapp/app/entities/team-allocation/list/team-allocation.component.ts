import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITeamAllocation } from '../team-allocation.model';
import { TeamAllocationService } from '../service/team-allocation.service';
import { TeamAllocationDeleteDialogComponent } from '../delete/team-allocation-delete-dialog.component';

@Component({
  selector: 'jhi-team-allocation',
  templateUrl: './team-allocation.component.html',
})
export class TeamAllocationComponent implements OnInit {
  teamAllocations?: ITeamAllocation[];
  isLoading = false;

  constructor(protected teamAllocationService: TeamAllocationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.teamAllocationService.query().subscribe(
      (res: HttpResponse<ITeamAllocation[]>) => {
        this.isLoading = false;
        this.teamAllocations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITeamAllocation): number {
    return item.id!;
  }

  delete(teamAllocation: ITeamAllocation): void {
    const modalRef = this.modalService.open(TeamAllocationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.teamAllocation = teamAllocation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
