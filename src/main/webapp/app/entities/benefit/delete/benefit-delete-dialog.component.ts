import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBenefit } from '../benefit.model';
import { BenefitService } from '../service/benefit.service';

@Component({
  templateUrl: './benefit-delete-dialog.component.html',
})
export class BenefitDeleteDialogComponent {
  benefit?: IBenefit;

  constructor(protected benefitService: BenefitService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.benefitService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
