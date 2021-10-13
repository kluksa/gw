import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProjectsComponent } from '../list/projects.component';
import { ProjectsDetailComponent } from '../detail/projects-detail.component';
import { ProjectsUpdateComponent } from '../update/projects-update.component';
import { ProjectsRoutingResolveService } from './projects-routing-resolve.service';

const projectsRoute: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectsDetailComponent,
    resolve: {
      projects: ProjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectsUpdateComponent,
    resolve: {
      projects: ProjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectsUpdateComponent,
    resolve: {
      projects: ProjectsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(projectsRoute)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
