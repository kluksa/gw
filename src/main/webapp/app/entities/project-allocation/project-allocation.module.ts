import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectAllocationComponent } from './list/project-allocation.component';
import { ProjectAllocationDetailComponent } from './detail/project-allocation-detail.component';
import { ProjectAllocationUpdateComponent } from './update/project-allocation-update.component';
import { ProjectAllocationDeleteDialogComponent } from './delete/project-allocation-delete-dialog.component';
import { ProjectAllocationRoutingModule } from './route/project-allocation-routing.module';

@NgModule({
  imports: [SharedModule, ProjectAllocationRoutingModule],
  declarations: [
    ProjectAllocationComponent,
    ProjectAllocationDetailComponent,
    ProjectAllocationUpdateComponent,
    ProjectAllocationDeleteDialogComponent,
  ],
  entryComponents: [ProjectAllocationDeleteDialogComponent],
})
export class ProjectAllocationModule {}
