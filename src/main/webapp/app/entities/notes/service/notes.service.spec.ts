import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INotes, Notes } from '../notes.model';

import { NotesService } from './notes.service';

describe('Service Tests', () => {
  describe('Notes Service', () => {
    let service: NotesService;
    let httpMock: HttpTestingController;
    let elemDefault: INotes;
    let expectedResult: INotes | INotes[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(NotesService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        timestamp: currentDate,
        note: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            timestamp: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Notes', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            timestamp: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timestamp: currentDate,
          },
          returnedFromService
        );

        service.create(new Notes()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Notes', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            timestamp: currentDate.format(DATE_TIME_FORMAT),
            note: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timestamp: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Notes', () => {
        const patchObject = Object.assign({}, new Notes());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            timestamp: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Notes', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            timestamp: currentDate.format(DATE_TIME_FORMAT),
            note: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            timestamp: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Notes', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addNotesToCollectionIfMissing', () => {
        it('should add a Notes to an empty array', () => {
          const notes: INotes = { id: 123 };
          expectedResult = service.addNotesToCollectionIfMissing([], notes);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(notes);
        });

        it('should not add a Notes to an array that contains it', () => {
          const notes: INotes = { id: 123 };
          const notesCollection: INotes[] = [
            {
              ...notes,
            },
            { id: 456 },
          ];
          expectedResult = service.addNotesToCollectionIfMissing(notesCollection, notes);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Notes to an array that doesn't contain it", () => {
          const notes: INotes = { id: 123 };
          const notesCollection: INotes[] = [{ id: 456 }];
          expectedResult = service.addNotesToCollectionIfMissing(notesCollection, notes);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(notes);
        });

        it('should add only unique Notes to an array', () => {
          const notesArray: INotes[] = [{ id: 123 }, { id: 456 }, { id: 12980 }];
          const notesCollection: INotes[] = [{ id: 123 }];
          expectedResult = service.addNotesToCollectionIfMissing(notesCollection, ...notesArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const notes: INotes = { id: 123 };
          const notes2: INotes = { id: 456 };
          expectedResult = service.addNotesToCollectionIfMissing([], notes, notes2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(notes);
          expect(expectedResult).toContain(notes2);
        });

        it('should accept null and undefined values', () => {
          const notes: INotes = { id: 123 };
          expectedResult = service.addNotesToCollectionIfMissing([], null, notes, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(notes);
        });

        it('should return initial array if no Notes is added', () => {
          const notesCollection: INotes[] = [{ id: 123 }];
          expectedResult = service.addNotesToCollectionIfMissing(notesCollection, undefined, null);
          expect(expectedResult).toEqual(notesCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
