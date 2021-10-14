import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBenefit, Benefit } from '../benefit.model';
import { BenefitService } from '../service/benefit.service';

@Injectable({ providedIn: 'root' })
export class BenefitRoutingResolveService implements Resolve<IBenefit> {
  constructor(protected service: BenefitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBenefit> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((benefit: HttpResponse<Benefit>) => {
          if (benefit.body) {
            return of(benefit.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Benefit());
  }
}
