import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TeamsComponent } from './list/teams.component';
import { TeamsDetailComponent } from './detail/teams-detail.component';
import { TeamsUpdateComponent } from './update/teams-update.component';
import { TeamsDeleteDialogComponent } from './delete/teams-delete-dialog.component';
import { TeamsRoutingModule } from './route/teams-routing.module';

@NgModule({
  imports: [SharedModule, TeamsRoutingModule],
  declarations: [TeamsComponent, TeamsDetailComponent, TeamsUpdateComponent, TeamsDeleteDialogComponent],
  entryComponents: [TeamsDeleteDialogComponent],
})
export class TeamsModule {}
