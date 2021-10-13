import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjectAllocation, ProjectAllocation } from '../project-allocation.model';
import { ProjectAllocationService } from '../service/project-allocation.service';

@Injectable({ providedIn: 'root' })
export class ProjectAllocationRoutingResolveService implements Resolve<IProjectAllocation> {
  constructor(protected service: ProjectAllocationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProjectAllocation> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((projectAllocation: HttpResponse<ProjectAllocation>) => {
          if (projectAllocation.body) {
            return of(projectAllocation.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProjectAllocation());
  }
}
