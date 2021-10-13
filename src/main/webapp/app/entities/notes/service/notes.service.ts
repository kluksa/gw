import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INotes, getNotesIdentifier } from '../notes.model';

export type EntityResponseType = HttpResponse<INotes>;
export type EntityArrayResponseType = HttpResponse<INotes[]>;

@Injectable({ providedIn: 'root' })
export class NotesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(notes: INotes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notes);
    return this.http
      .post<INotes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(notes: INotes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notes);
    return this.http
      .put<INotes>(`${this.resourceUrl}/${getNotesIdentifier(notes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(notes: INotes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(notes);
    return this.http
      .patch<INotes>(`${this.resourceUrl}/${getNotesIdentifier(notes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<INotes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<INotes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNotesToCollectionIfMissing(notesCollection: INotes[], ...notesToCheck: (INotes | null | undefined)[]): INotes[] {
    const notes: INotes[] = notesToCheck.filter(isPresent);
    if (notes.length > 0) {
      const notesCollectionIdentifiers = notesCollection.map(notesItem => getNotesIdentifier(notesItem)!);
      const notesToAdd = notes.filter(notesItem => {
        const notesIdentifier = getNotesIdentifier(notesItem);
        if (notesIdentifier == null || notesCollectionIdentifiers.includes(notesIdentifier)) {
          return false;
        }
        notesCollectionIdentifiers.push(notesIdentifier);
        return true;
      });
      return [...notesToAdd, ...notesCollection];
    }
    return notesCollection;
  }

  protected convertDateFromClient(notes: INotes): INotes {
    return Object.assign({}, notes, {
      timestamp: notes.timestamp?.isValid() ? notes.timestamp.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.timestamp = res.body.timestamp ? dayjs(res.body.timestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((notes: INotes) => {
        notes.timestamp = notes.timestamp ? dayjs(notes.timestamp) : undefined;
      });
    }
    return res;
  }
}
