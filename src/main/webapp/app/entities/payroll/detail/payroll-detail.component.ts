import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPayroll } from '../payroll.model';

@Component({
  selector: 'jhi-payroll-detail',
  templateUrl: './payroll-detail.component.html',
})
export class PayrollDetailComponent implements OnInit {
  payroll: IPayroll | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payroll }) => {
      this.payroll = payroll;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
