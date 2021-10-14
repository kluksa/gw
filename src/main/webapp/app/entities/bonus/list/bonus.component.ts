import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IBonus } from '../bonus.model';
import { BonusService } from '../service/bonus.service';
import { BonusDeleteDialogComponent } from '../delete/bonus-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-bonus',
  templateUrl: './bonus.component.html',
})
export class BonusComponent implements OnInit {
  bonuses?: IBonus[];
  isLoading = false;

  constructor(protected bonusService: BonusService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.bonusService.query().subscribe(
      (res: HttpResponse<IBonus[]>) => {
        this.isLoading = false;
        this.bonuses = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IBonus): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(bonus: IBonus): void {
    const modalRef = this.modalService.open(BonusDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.bonus = bonus;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
