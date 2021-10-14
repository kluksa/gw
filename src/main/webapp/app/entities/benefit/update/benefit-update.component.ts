import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBenefit, Benefit } from '../benefit.model';
import { BenefitService } from '../service/benefit.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

@Component({
  selector: 'jhi-benefit-update',
  templateUrl: './benefit-update.component.html',
})
export class BenefitUpdateComponent implements OnInit {
  isSaving = false;

  employeesSharedCollection: IEmployee[] = [];

  editForm = this.fb.group({
    id: [],
    type: [],
    effectiveDate: [],
    value: [],
    endDate: [],
    employee: [],
  });

  constructor(
    protected benefitService: BenefitService,
    protected employeeService: EmployeeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ benefit }) => {
      this.updateForm(benefit);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const benefit = this.createFromForm();
    if (benefit.id !== undefined) {
      this.subscribeToSaveResponse(this.benefitService.update(benefit));
    } else {
      this.subscribeToSaveResponse(this.benefitService.create(benefit));
    }
  }

  trackEmployeeById(index: number, item: IEmployee): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBenefit>>): void {
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

  protected updateForm(benefit: IBenefit): void {
    this.editForm.patchValue({
      id: benefit.id,
      type: benefit.type,
      effectiveDate: benefit.effectiveDate,
      value: benefit.value,
      endDate: benefit.endDate,
      employee: benefit.employee,
    });

    this.employeesSharedCollection = this.employeeService.addEmployeeToCollectionIfMissing(
      this.employeesSharedCollection,
      benefit.employee
    );
  }

  protected loadRelationshipsOptions(): void {
    this.employeeService
      .query()
      .pipe(map((res: HttpResponse<IEmployee[]>) => res.body ?? []))
      .pipe(
        map((employees: IEmployee[]) =>
          this.employeeService.addEmployeeToCollectionIfMissing(employees, this.editForm.get('employee')!.value)
        )
      )
      .subscribe((employees: IEmployee[]) => (this.employeesSharedCollection = employees));
  }

  protected createFromForm(): IBenefit {
    return {
      ...new Benefit(),
      id: this.editForm.get(['id'])!.value,
      type: this.editForm.get(['type'])!.value,
      effectiveDate: this.editForm.get(['effectiveDate'])!.value,
      value: this.editForm.get(['value'])!.value,
      endDate: this.editForm.get(['endDate'])!.value,
      employee: this.editForm.get(['employee'])!.value,
    };
  }
}
