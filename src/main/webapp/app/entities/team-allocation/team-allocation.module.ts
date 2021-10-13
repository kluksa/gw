import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TeamAllocationComponent } from './list/team-allocation.component';
import { TeamAllocationDetailComponent } from './detail/team-allocation-detail.component';
import { TeamAllocationUpdateComponent } from './update/team-allocation-update.component';
import { TeamAllocationDeleteDialogComponent } from './delete/team-allocation-delete-dialog.component';
import { TeamAllocationRoutingModule } from './route/team-allocation-routing.module';

@NgModule({
  imports: [SharedModule, TeamAllocationRoutingModule],
  declarations: [
    TeamAllocationComponent,
    TeamAllocationDetailComponent,
    TeamAllocationUpdateComponent,
    TeamAllocationDeleteDialogComponent,
  ],
  entryComponents: [TeamAllocationDeleteDialogComponent],
})
export class TeamAllocationModule {}
