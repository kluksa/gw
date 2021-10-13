import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPayroll, getPayrollIdentifier } from '../payroll.model';

export type EntityResponseType = HttpResponse<IPayroll>;
export type EntityArrayResponseType = HttpResponse<IPayroll[]>;

@Injectable({ providedIn: 'root' })
export class PayrollService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/payrolls');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(payroll: IPayroll): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payroll);
    return this.http
      .post<IPayroll>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(payroll: IPayroll): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payroll);
    return this.http
      .put<IPayroll>(`${this.resourceUrl}/${getPayrollIdentifier(payroll) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(payroll: IPayroll): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(payroll);
    return this.http
      .patch<IPayroll>(`${this.resourceUrl}/${getPayrollIdentifier(payroll) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPayroll>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPayroll[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPayrollToCollectionIfMissing(payrollCollection: IPayroll[], ...payrollsToCheck: (IPayroll | null | undefined)[]): IPayroll[] {
    const payrolls: IPayroll[] = payrollsToCheck.filter(isPresent);
    if (payrolls.length > 0) {
      const payrollCollectionIdentifiers = payrollCollection.map(payrollItem => getPayrollIdentifier(payrollItem)!);
      const payrollsToAdd = payrolls.filter(payrollItem => {
        const payrollIdentifier = getPayrollIdentifier(payrollItem);
        if (payrollIdentifier == null || payrollCollectionIdentifiers.includes(payrollIdentifier)) {
          return false;
        }
        payrollCollectionIdentifiers.push(payrollIdentifier);
        return true;
      });
      return [...payrollsToAdd, ...payrollCollection];
    }
    return payrollCollection;
  }

  protected convertDateFromClient(payroll: IPayroll): IPayroll {
    return Object.assign({}, payroll, {
      effectiveDate: payroll.effectiveDate?.isValid() ? payroll.effectiveDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.effectiveDate = res.body.effectiveDate ? dayjs(res.body.effectiveDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((payroll: IPayroll) => {
        payroll.effectiveDate = payroll.effectiveDate ? dayjs(payroll.effectiveDate) : undefined;
      });
    }
    return res;
  }
}
