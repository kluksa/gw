import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBenefit } from '../benefit.model';
import { BenefitService } from '../service/benefit.service';
import { BenefitDeleteDialogComponent } from '../delete/benefit-delete-dialog.component';

@Component({
  selector: 'jhi-benefit',
  templateUrl: './benefit.component.html',
})
export class BenefitComponent implements OnInit {
  benefits?: IBenefit[];
  isLoading = false;

  constructor(protected benefitService: BenefitService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.benefitService.query().subscribe(
      (res: HttpResponse<IBenefit[]>) => {
        this.isLoading = false;
        this.benefits = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBenefit): number {
    return item.id!;
  }

  delete(benefit: IBenefit): void {
    const modalRef = this.modalService.open(BenefitDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.benefit = benefit;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
