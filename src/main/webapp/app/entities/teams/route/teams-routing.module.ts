import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TeamsComponent } from '../list/teams.component';
import { TeamsDetailComponent } from '../detail/teams-detail.component';
import { TeamsUpdateComponent } from '../update/teams-update.component';
import { TeamsRoutingResolveService } from './teams-routing-resolve.service';

const teamsRoute: Routes = [
  {
    path: '',
    component: TeamsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TeamsDetailComponent,
    resolve: {
      teams: TeamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TeamsUpdateComponent,
    resolve: {
      teams: TeamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TeamsUpdateComponent,
    resolve: {
      teams: TeamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(teamsRoute)],
  exports: [RouterModule],
})
export class TeamsRoutingModule {}
