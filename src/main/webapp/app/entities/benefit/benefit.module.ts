import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BenefitComponent } from './list/benefit.component';
import { BenefitDetailComponent } from './detail/benefit-detail.component';
import { BenefitUpdateComponent } from './update/benefit-update.component';
import { BenefitDeleteDialogComponent } from './delete/benefit-delete-dialog.component';
import { BenefitRoutingModule } from './route/benefit-routing.module';

@NgModule({
  imports: [SharedModule, BenefitRoutingModule],
  declarations: [BenefitComponent, BenefitDetailComponent, BenefitUpdateComponent, BenefitDeleteDialogComponent],
  entryComponents: [BenefitDeleteDialogComponent],
})
export class BenefitModule {}
