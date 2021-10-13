import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProjectAllocationComponent } from '../list/project-allocation.component';
import { ProjectAllocationDetailComponent } from '../detail/project-allocation-detail.component';
import { ProjectAllocationUpdateComponent } from '../update/project-allocation-update.component';
import { ProjectAllocationRoutingResolveService } from './project-allocation-routing-resolve.service';

const projectAllocationRoute: Routes = [
  {
    path: '',
    component: ProjectAllocationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectAllocationDetailComponent,
    resolve: {
      projectAllocation: ProjectAllocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectAllocationUpdateComponent,
    resolve: {
      projectAllocation: ProjectAllocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectAllocationUpdateComponent,
    resolve: {
      projectAllocation: ProjectAllocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(projectAllocationRoute)],
  exports: [RouterModule],
})
export class ProjectAllocationRoutingModule {}
