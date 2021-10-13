import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPayroll } from '../payroll.model';
import { PayrollService } from '../service/payroll.service';
import { PayrollDeleteDialogComponent } from '../delete/payroll-delete-dialog.component';

@Component({
  selector: 'jhi-payroll',
  templateUrl: './payroll.component.html',
})
export class PayrollComponent implements OnInit {
  payrolls?: IPayroll[];
  isLoading = false;

  constructor(protected payrollService: PayrollService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.payrollService.query().subscribe(
      (res: HttpResponse<IPayroll[]>) => {
        this.isLoading = false;
        this.payrolls = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPayroll): number {
    return item.id!;
  }

  delete(payroll: IPayroll): void {
    const modalRef = this.modalService.open(PayrollDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.payroll = payroll;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
