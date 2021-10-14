import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITeamAllocation, TeamAllocation } from '../team-allocation.model';
import { TeamAllocationService } from '../service/team-allocation.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { ITeams } from 'app/entities/teams/teams.model';
import { TeamsService } from 'app/entities/teams/service/teams.service';

@Component({
  selector: 'jhi-team-allocation-update',
  templateUrl: './team-allocation-update.component.html',
})
export class TeamAllocationUpdateComponent implements OnInit {
  isSaving = false;

  employeesSharedCollection: IEmployee[] = [];
  teamsSharedCollection: ITeams[] = [];

  editForm = this.fb.group({
    id: [],
    start: [],
    end: [],
    note: [],
    member: [],
    team: [],
  });

  constructor(
    protected teamAllocationService: TeamAllocationService,
    protected employeeService: EmployeeService,
    protected teamsService: TeamsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teamAllocation }) => {
      this.updateForm(teamAllocation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const teamAllocation = this.createFromForm();
    if (teamAllocation.id !== undefined) {
      this.subscribeToSaveResponse(this.teamAllocationService.update(teamAllocation));
    } else {
      this.subscribeToSaveResponse(this.teamAllocationService.create(teamAllocation));
    }
  }

  trackEmployeeById(index: number, item: IEmployee): number {
    return item.id!;
  }

  trackTeamsById(index: number, item: ITeams): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeamAllocation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(teamAllocation: ITeamAllocation): void {
    this.editForm.patchValue({
      id: teamAllocation.id,
      start: teamAllocation.start,
      end: teamAllocation.end,
      note: teamAllocation.note,
      member: teamAllocation.member,
      team: teamAllocation.team,
    });

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing(
      this.employeesSharedCollection,
      teamAllocation.member
    );
    this.teamsSharedCollection = this.teamsService.addTeamsToCollectionIfMissing(this.teamsSharedCollection, teamAllocation.team);
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing(employees, this.editForm.get('member')!.value)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));

    this.teamsService
      .query()
      .pipe(map((res: HttpResponse<ITeams[]>) => res.body ?? []))
      .pipe(map((teams: ITeams[]) => this.teamsService.addTeamsToCollectionIfMissing(teams, this.editForm.get('team')!.value)))
      .subscribe((teams: ITeams[]) => (this.teamsSharedCollection = teams));
  }

  protected createFromForm(): ITeamAllocation {
    return {
      ...new TeamAllocation(),
      id: this.editForm.get(['id'])!.value,
      start: this.editForm.get(['start'])!.value,
      end: this.editForm.get(['end'])!.value,
      note: this.editForm.get(['note'])!.value,
      member: this.editForm.get(['member'])!.value,
      team: this.editForm.get(['team'])!.value,
    };
  }
}
