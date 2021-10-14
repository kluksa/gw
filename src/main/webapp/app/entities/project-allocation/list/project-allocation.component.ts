import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProjectAllocation } from '../project-allocation.model';
import { ProjectAllocationService } from '../service/project-allocation.service';
import { ProjectAllocationDeleteDialogComponent } from '../delete/project-allocation-delete-dialog.component';

@Component({
  selector: 'jhi-project-allocation',
  templateUrl: './project-allocation.component.html',
})
export class ProjectAllocationComponent implements OnInit {
  projectAllocations?: IProjectAllocation[];
  isLoading = false;

  constructor(protected projectAllocationService: ProjectAllocationService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.projectAllocationService.query().subscribe(
      (res: HttpResponse<IProjectAllocation[]>) => {
        this.isLoading = false;
        this.projectAllocations = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProjectAllocation): number {
    return item.id!;
  }

  delete(projectAllocation: IProjectAllocation): void {
    const modalRef = this.modalService.open(ProjectAllocationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.projectAllocation = projectAllocation;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
