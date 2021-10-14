import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProjects, Projects } from '../projects.model';
import { ProjectsService } from '../service/projects.service';

@Injectable({ providedIn: 'root' })
export class ProjectsRoutingResolveService implements Resolve<IProjects> {
  constructor(protected service: ProjectsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProjects> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((projects: HttpResponse<Projects>) => {
          if (projects.body) {
            return of(projects.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Projects());
  }
}
