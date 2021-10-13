import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBonus, getBonusIdentifier } from '../bonus.model';

export type EntityResponseType = HttpResponse<IBonus>;
export type EntityArrayResponseType = HttpResponse<IBonus[]>;

@Injectable({ providedIn: 'root' })
export class BonusService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bonuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(bonus: IBonus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bonus);
    return this.http
      .post<IBonus>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(bonus: IBonus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bonus);
    return this.http
      .put<IBonus>(`${this.resourceUrl}/${getBonusIdentifier(bonus) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(bonus: IBonus): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(bonus);
    return this.http
      .patch<IBonus>(`${this.resourceUrl}/${getBonusIdentifier(bonus) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IBonus>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IBonus[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBonusToCollectionIfMissing(bonusCollection: IBonus[], ...bonusesToCheck: (IBonus | null | undefined)[]): IBonus[] {
    const bonuses: IBonus[] = bonusesToCheck.filter(isPresent);
    if (bonuses.length > 0) {
      const bonusCollectionIdentifiers = bonusCollection.map(bonusItem => getBonusIdentifier(bonusItem)!);
      const bonusesToAdd = bonuses.filter(bonusItem => {
        const bonusIdentifier = getBonusIdentifier(bonusItem);
        if (bonusIdentifier == null || bonusCollectionIdentifiers.includes(bonusIdentifier)) {
          return false;
        }
        bonusCollectionIdentifiers.push(bonusIdentifier);
        return true;
      });
      return [...bonusesToAdd, ...bonusCollection];
    }
    return bonusCollection;
  }

  protected convertDateFromClient(bonus: IBonus): IBonus {
    return Object.assign({}, bonus, {
      effectiveDate: bonus.effectiveDate?.isValid() ? bonus.effectiveDate.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((bonus: IBonus) => {
        bonus.effectiveDate = bonus.effectiveDate ? dayjs(bonus.effectiveDate) : undefined;
      });
    }
    return res;
  }
}
