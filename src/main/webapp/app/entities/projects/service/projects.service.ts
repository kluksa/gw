import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProjects, getProjectsIdentifier } from '../projects.model';

export type EntityResponseType = HttpResponse<IProjects>;
export type EntityArrayResponseType = HttpResponse<IProjects[]>;

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/projects');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(projects: IProjects): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projects);
    return this.http
      .post<IProjects>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(projects: IProjects): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projects);
    return this.http
      .put<IProjects>(`${this.resourceUrl}/${getProjectsIdentifier(projects) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(projects: IProjects): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(projects);
    return this.http
      .patch<IProjects>(`${this.resourceUrl}/${getProjectsIdentifier(projects) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IProjects>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IProjects[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProjectsToCollectionIfMissing(projectsCollection: IProjects[], ...projectsToCheck: (IProjects | null | undefined)[]): IProjects[] {
    const projects: IProjects[] = projectsToCheck.filter(isPresent);
    if (projects.length > 0) {
      const projectsCollectionIdentifiers = projectsCollection.map(projectsItem => getProjectsIdentifier(projectsItem)!);
      const projectsToAdd = projects.filter(projectsItem => {
        const projectsIdentifier = getProjectsIdentifier(projectsItem);
        if (projectsIdentifier == null || projectsCollectionIdentifiers.includes(projectsIdentifier)) {
          return false;
        }
        projectsCollectionIdentifiers.push(projectsIdentifier);
        return true;
      });
      return [...projectsToAdd, ...projectsCollection];
    }
    return projectsCollection;
  }

  protected convertDateFromClient(projects: IProjects): IProjects {
    return Object.assign({}, projects, {
      start: projects.start?.isValid() ? projects.start.format(DATE_FORMAT) : undefined,
      end: projects.end?.isValid() ? projects.end.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((projects: IProjects) => {
        projects.start = projects.start ? dayjs(projects.start) : undefined;
        projects.end = projects.end ? dayjs(projects.end) : undefined;
      });
    }
    return res;
  }
}
