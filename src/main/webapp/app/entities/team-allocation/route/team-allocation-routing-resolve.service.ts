import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeamAllocation, TeamAllocation } from '../team-allocation.model';
import { TeamAllocationService } from '../service/team-allocation.service';

@Injectable({ providedIn: 'root' })
export class TeamAllocationRoutingResolveService implements Resolve<ITeamAllocation> {
  constructor(protected service: TeamAllocationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeamAllocation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((teamAllocation: HttpResponse<TeamAllocation>) => {
          if (teamAllocation.body) {
            return of(teamAllocation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new TeamAllocation());
  }
}
