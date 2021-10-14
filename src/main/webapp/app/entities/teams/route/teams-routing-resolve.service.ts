import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITeams, Teams } from '../teams.model';
import { TeamsService } from '../service/teams.service';

@Injectable({ providedIn: 'root' })
export class TeamsRoutingResolveService implements Resolve<ITeams> {
  constructor(protected service: TeamsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITeams> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((teams: HttpResponse<Teams>) => {
          if (teams.body) {
            return of(teams.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Teams());
  }
}
