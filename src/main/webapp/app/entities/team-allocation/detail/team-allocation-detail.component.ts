import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeamAllocation } from '../team-allocation.model';

@Component({
  selector: 'jhi-team-allocation-detail',
  templateUrl: './team-allocation-detail.component.html',
})
export class TeamAllocationDetailComponent implements OnInit {
  teamAllocation: ITeamAllocation | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teamAllocation }) => {
      this.teamAllocation = teamAllocation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
