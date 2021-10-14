import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectsComponent } from './list/projects.component';
import { ProjectsDetailComponent } from './detail/projects-detail.component';
import { ProjectsUpdateComponent } from './update/projects-update.component';
import { ProjectsDeleteDialogComponent } from './delete/projects-delete-dialog.component';
import { ProjectsRoutingModule } from './route/projects-routing.module';

@NgModule({
  imports: [SharedModule, ProjectsRoutingModule],
  declarations: [ProjectsComponent, ProjectsDetailComponent, ProjectsUpdateComponent, ProjectsDeleteDialogComponent],
  entryComponents: [ProjectsDeleteDialogComponent],
})
export class ProjectsModule {}
