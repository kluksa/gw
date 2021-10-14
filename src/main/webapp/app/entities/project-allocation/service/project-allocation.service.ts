import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjectAllocation, getProjectAllocationIdentifier } from '../project-allocation.model';

export type EntityResponseType = HttpResponse<IProjectAllocation>;
export type EntityArrayResponseType = HttpResponse<IProjectAllocation[]>;

@Injectable({ providedIn: 'root' })
export class ProjectAllocationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/project-allocations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(projectAllocation: IProjectAllocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectAllocation);
    return this.http
      .post<IProjectAllocation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(projectAllocation: IProjectAllocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectAllocation);
    return this.http
      .put<IProjectAllocation>(`${this.resourceUrl}/${getProjectAllocationIdentifier(projectAllocation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(projectAllocation: IProjectAllocation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projectAllocation);
    return this.http
      .patch<IProjectAllocation>(`${this.resourceUrl}/${getProjectAllocationIdentifier(projectAllocation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProjectAllocation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProjectAllocation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProjectAllocationToCollectionIfMissing(
    projectAllocationCollection: IProjectAllocation[],
    ...projectAllocationsToCheck: (IProjectAllocation | null | undefined)[]
  ): IProjectAllocation[] {
    const projectAllocations: IProjectAllocation[] = projectAllocationsToCheck.filter(isPresent);
    if (projectAllocations.length > 0) {
      const projectAllocationCollectionIdentifiers = projectAllocationCollection.map(
        projectAllocationItem => getProjectAllocationIdentifier(projectAllocationItem)!
      );
      const projectAllocationsToAdd = projectAllocations.filter(projectAllocationItem => {
        const projectAllocationIdentifier = getProjectAllocationIdentifier(projectAllocationItem);
        if (projectAllocationIdentifier == null || projectAllocationCollectionIdentifiers.includes(projectAllocationIdentifier)) {
          return false;
        }
        projectAllocationCollectionIdentifiers.push(projectAllocationIdentifier);
        return true;
      });
      return [...projectAllocationsToAdd, ...projectAllocationCollection];
    }
    return projectAllocationCollection;
  }

  protected convertDateFromClient(projectAllocation: IProjectAllocation): IProjectAllocation {
    return Object.assign({}, projectAllocation, {
      start: projectAllocation.start?.isValid() ? projectAllocation.start.format(DATE_FORMAT) : undefined,
      end: projectAllocation.end?.isValid() ? projectAllocation.end.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((projectAllocation: IProjectAllocation) => {
        projectAllocation.start = projectAllocation.start ? dayjs(projectAllocation.start) : undefined;
        projectAllocation.end = projectAllocation.end ? dayjs(projectAllocation.end) : undefined;
      });
    }
    return res;
  }
}
