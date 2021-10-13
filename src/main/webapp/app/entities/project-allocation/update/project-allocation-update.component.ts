import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProjectAllocation, ProjectAllocation } from '../project-allocation.model';
import { ProjectAllocationService } from '../service/project-allocation.service';
import { IProjects } from 'app/entities/projects/projects.model';
import { ProjectsService } from 'app/entities/projects/service/projects.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

@Component({
  selector: 'jhi-project-allocation-update',
  templateUrl: './project-allocation-update.component.html',
})
export class ProjectAllocationUpdateComponent implements OnInit {
  isSaving = false;

  projectsSharedCollection: IProjects[] = [];
  employeesSharedCollection: IEmployee[] = [];

  editForm = this.fb.group({
    id: [],
    start: [],
    end: [],
    note: [],
    project: [],
    member: [],
  });

  constructor(
    protected projectAllocationService: ProjectAllocationService,
    protected projectsService: ProjectsService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ projectAllocation }) => {
      this.updateForm(projectAllocation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const projectAllocation = this.createFromForm();
    if (projectAllocation.id !== undefined) {
      this.subscribeToSaveResponse(this.projectAllocationService.update(projectAllocation));
    } else {
      this.subscribeToSaveResponse(this.projectAllocationService.create(projectAllocation));
    }
  }

  trackProjectsById(index: number, item: IProjects): number {
    return item.id!;
  }

  trackEmployeeById(index: number, item: IEmployee): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProjectAllocation>>): void {
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

  protected updateForm(projectAllocation: IProjectAllocation): void {
    this.editForm.patchValue({
      id: projectAllocation.id,
      start: projectAllocation.start,
      end: projectAllocation.end,
      note: projectAllocation.note,
      project: projectAllocation.project,
      member: projectAllocation.member,
    });

    this.projectsSharedCollection = this.projectsService.addProjectsToCollectionIfMissing(
      this.projectsSharedCollection,
      projectAllocation.project
    );
    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing(
      this.employeesSharedCollection,
      projectAllocation.member
    );
  }

  protected loadRelationshipsOptions(): void {
    this.projectsService
      .query()
      .pipe(map((res: HttpResponse<IProjects[]>) => res.body ?? []))
      .pipe(
        map((projects: IProjects[]) => this.projectsService.addProjectsToCollectionIfMissing(projects, this.editForm.get('project')!.value))
      )
      .subscribe((projects: IProjects[]) => (this.projectsSharedCollection = projects));

    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing(employees, this.editForm.get('member')!.value)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));
  }

  protected createFromForm(): IProjectAllocation {
    return {
      ...new ProjectAllocation(),
      id: this.editForm.get(['id'])!.value,
      start: this.editForm.get(['start'])!.value,
      end: this.editForm.get(['end'])!.value,
      note: this.editForm.get(['note'])!.value,
      project: this.editForm.get(['project'])!.value,
      member: this.editForm.get(['member'])!.value,
    };
  }
}
