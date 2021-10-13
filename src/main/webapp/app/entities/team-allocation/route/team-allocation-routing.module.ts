import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeamAllocationComponent } from '../list/team-allocation.component';
import { TeamAllocationDetailComponent } from '../detail/team-allocation-detail.component';
import { TeamAllocationUpdateComponent } from '../update/team-allocation-update.component';
import { TeamAllocationRoutingResolveService } from './team-allocation-routing-resolve.service';

const teamAllocationRoute: Routes = [
  {
    path: '',
    component: TeamAllocationComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamAllocationDetailComponent,
    resolve: {
      teamAllocation: TeamAllocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamAllocationUpdateComponent,
    resolve: {
      teamAllocation: TeamAllocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamAllocationUpdateComponent,
    resolve: {
      teamAllocation: TeamAllocationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(teamAllocationRoute)],
  exports: [RouterModule],
})
export class TeamAllocationRoutingModule {}
