import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPayroll, Payroll } from '../payroll.model';
import { PayrollService } from '../service/payroll.service';

@Injectable({ providedIn: 'root' })
export class PayrollRoutingResolveService implements Resolve<IPayroll> {
  constructor(protected service: PayrollService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPayroll> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((payroll: HttpResponse<Payroll>) => {
          if (payroll.body) {
            return of(payroll.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Payroll());
  }
}
