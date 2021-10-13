import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBenefit, getBenefitIdentifier } from '../benefit.model';

export type EntityResponseType = HttpResponse<IBenefit>;
export type EntityArrayResponseType = HttpResponse<IBenefit[]>;

@Injectable({ providedIn: 'root' })
export class BenefitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/benefits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(benefit: IBenefit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(benefit);
    return this.http
      .post<IBenefit>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(benefit: IBenefit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(benefit);
    return this.http
      .put<IBenefit>(`${this.resourceUrl}/${getBenefitIdentifier(benefit) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(benefit: IBenefit): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(benefit);
    return this.http
      .patch<IBenefit>(`${this.resourceUrl}/${getBenefitIdentifier(benefit) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBenefit>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBenefit[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBenefitToCollectionIfMissing(benefitCollection: IBenefit[], ...benefitsToCheck: (IBenefit | null | undefined)[]): IBenefit[] {
    const benefits: IBenefit[] = benefitsToCheck.filter(isPresent);
    if (benefits.length > 0) {
      const benefitCollectionIdentifiers = benefitCollection.map(benefitItem => getBenefitIdentifier(benefitItem)!);
      const benefitsToAdd = benefits.filter(benefitItem => {
        const benefitIdentifier = getBenefitIdentifier(benefitItem);
        if (benefitIdentifier == null || benefitCollectionIdentifiers.includes(benefitIdentifier)) {
          return false;
        }
        benefitCollectionIdentifiers.push(benefitIdentifier);
        return true;
      });
      return [...benefitsToAdd, ...benefitCollection];
    }
    return benefitCollection;
  }

  protected convertDateFromClient(benefit: IBenefit): IBenefit {
    return Object.assign({}, benefit, {
      effectiveDate: benefit.effectiveDate?.isValid() ? benefit.effectiveDate.format(DATE_FORMAT) : undefined,
      endDate: benefit.endDate?.isValid() ? benefit.endDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.effectiveDate = res.body.effectiveDate ? dayjs(res.body.effectiveDate) : undefined;
      res.body.endDate = res.body.endDate ? dayjs(res.body.endDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((benefit: IBenefit) => {
        benefit.effectiveDate = benefit.effectiveDate ? dayjs(benefit.effectiveDate) : undefined;
        benefit.endDate = benefit.endDate ? dayjs(benefit.endDate) : undefined;
      });
    }
    return res;
  }
}
