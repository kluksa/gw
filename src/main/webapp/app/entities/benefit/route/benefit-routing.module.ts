import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BenefitComponent } from '../list/benefit.component';
import { BenefitDetailComponent } from '../detail/benefit-detail.component';
import { BenefitUpdateComponent } from '../update/benefit-update.component';
import { BenefitRoutingResolveService } from './benefit-routing-resolve.service';

const benefitRoute: Routes = [
  {
    path: '',
    component: BenefitComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BenefitDetailComponent,
    resolve: {
      benefit: BenefitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BenefitUpdateComponent,
    resolve: {
      benefit: BenefitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BenefitUpdateComponent,
    resolve: {
      benefit: BenefitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(benefitRoute)],
  exports: [RouterModule],
})
export class BenefitRoutingModule {}
