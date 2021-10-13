import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITeams } from '../teams.model';

@Component({
  selector: 'jhi-teams-detail',
  templateUrl: './teams-detail.component.html',
})
export class TeamsDetailComponent implements OnInit {
  teams: ITeams | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teams }) => {
      this.teams = teams;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
