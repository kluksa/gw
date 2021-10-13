import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITeams, getTeamsIdentifier } from '../teams.model';

export type EntityResponseType = HttpResponse<ITeams>;
export type EntityArrayResponseType = HttpResponse<ITeams[]>;

@Injectable({ providedIn: 'root' })
export class TeamsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/teams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(teams: ITeams): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(teams);
    return this.http
      .post<ITeams>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(teams: ITeams): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(teams);
    return this.http
      .put<ITeams>(`${this.resourceUrl}/${getTeamsIdentifier(teams) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(teams: ITeams): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(teams);
    return this.http
      .patch<ITeams>(`${this.resourceUrl}/${getTeamsIdentifier(teams) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITeams>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITeams[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTeamsToCollectionIfMissing(teamsCollection: ITeams[], ...teamsToCheck: (ITeams | null | undefined)[]): ITeams[] {
    const teams: ITeams[] = teamsToCheck.filter(isPresent);
    if (teams.length > 0) {
      const teamsCollectionIdentifiers = teamsCollection.map(teamsItem => getTeamsIdentifier(teamsItem)!);
      const teamsToAdd = teams.filter(teamsItem => {
        const teamsIdentifier = getTeamsIdentifier(teamsItem);
        if (teamsIdentifier == null || teamsCollectionIdentifiers.includes(teamsIdentifier)) {
          return false;
        }
        teamsCollectionIdentifiers.push(teamsIdentifier);
        return true;
      });
      return [...teamsToAdd, ...teamsCollection];
    }
    return teamsCollection;
  }

  protected convertDateFromClient(teams: ITeams): ITeams {
    return Object.assign({}, teams, {
      start: teams.start?.isValid() ? teams.start.format(DATE_FORMAT) : undefined,
      end: teams.end?.isValid() ? teams.end.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((teams: ITeams) => {
        teams.start = teams.start ? dayjs(teams.start) : undefined;
        teams.end = teams.end ? dayjs(teams.end) : undefined;
      });
    }
    return res;
  }
}
