import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITeamAllocation, getTeamAllocationIdentifier } from '../team-allocation.model';

export type EntityResponseType = HttpResponse<ITeamAllocation>;
export type EntityArrayResponseType = HttpResponse<ITeamAllocation[]>;

@Injectable({ providedIn: 'root' })
export class TeamAllocationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/team-allocations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(teamAllocation: ITeamAllocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(teamAllocation);
    return this.http
      .post<ITeamAllocation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(teamAllocation: ITeamAllocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(teamAllocation);
    return this.http
      .put<ITeamAllocation>(`${this.resourceUrl}/${getTeamAllocationIdentifier(teamAllocation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(teamAllocation: ITeamAllocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(teamAllocation);
    return this.http
      .patch<ITeamAllocation>(`${this.resourceUrl}/${getTeamAllocationIdentifier(teamAllocation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITeamAllocation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITeamAllocation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTeamAllocationToCollectionIfMissing(
    teamAllocationCollection: ITeamAllocation[],
    ...teamAllocationsToCheck: (ITeamAllocation | null | undefined)[]
  ): ITeamAllocation[] {
    const teamAllocations: ITeamAllocation[] = teamAllocationsToCheck.filter(isPresent);
    if (teamAllocations.length > 0) {
      const teamAllocationCollectionIdentifiers = teamAllocationCollection.map(
        teamAllocationItem => getTeamAllocationIdentifier(teamAllocationItem)!
      );
      const teamAllocationsToAdd = teamAllocations.filter(teamAllocationItem => {
        const teamAllocationIdentifier = getTeamAllocationIdentifier(teamAllocationItem);
        if (teamAllocationIdentifier == null || teamAllocationCollectionIdentifiers.includes(teamAllocationIdentifier)) {
          return false;
        }
        teamAllocationCollectionIdentifiers.push(teamAllocationIdentifier);
        return true;
      });
      return [...teamAllocationsToAdd, ...teamAllocationCollection];
    }
    return teamAllocationCollection;
  }

  protected convertDateFromClient(teamAllocation: ITeamAllocation): ITeamAllocation {
    return Object.assign({}, teamAllocation, {
      start: teamAllocation.start?.isValid() ? teamAllocation.start.format(DATE_FORMAT) : undefined,
      end: teamAllocation.end?.isValid() ? teamAllocation.end.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.start = res.body.start ? dayjs(res.body.start) : undefined;
      res.body.end = res.body.end ? dayjs(res.body.end) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((teamAllocation: ITeamAllocation) => {
        teamAllocation.start = teamAllocation.start ? dayjs(teamAllocation.start) : undefined;
        teamAllocation.end = teamAllocation.end ? dayjs(teamAllocation.end) : undefined;
      });
    }
    return res;
  }
}
