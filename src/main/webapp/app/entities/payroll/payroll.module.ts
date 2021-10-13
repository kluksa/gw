import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PayrollComponent } from './list/payroll.component';
import { PayrollDetailComponent } from './detail/payroll-detail.component';
import { PayrollUpdateComponent } from './update/payroll-update.component';
import { PayrollDeleteDialogComponent } from './delete/payroll-delete-dialog.component';
import { PayrollRoutingModule } from './route/payroll-routing.module';

@NgModule({
  imports: [SharedModule, PayrollRoutingModule],
  declarations: [PayrollComponent, PayrollDetailComponent, PayrollUpdateComponent, PayrollDeleteDialogComponent],
  entryComponents: [PayrollDeleteDialogComponent],
})
export class PayrollModule {}
