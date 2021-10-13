import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITeams, Teams } from '../teams.model';

import { TeamsService } from './teams.service';

describe('Service Tests', () => {
  describe('Teams Service', () => {
    let service: TeamsService;
    let httpMock: HttpTestingController;
    let elemDefault: ITeams;
    let expectedResult: ITeams | ITeams[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TeamsService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        start: currentDate,
        end: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Teams', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            start: currentDate,
            end: currentDate,
          },
          returnedFromService
        );

        service.create(new Teams()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Teams', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            start: currentDate,
            end: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Teams', () => {
        const patchObject = Object.assign(
          {
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
          },
          new Teams()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            start: currentDate,
            end: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Teams', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            start: currentDate,
            end: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Teams', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTeamsToCollectionIfMissing', () => {
        it('should add a Teams to an empty array', () => {
          const teams: ITeams = { id: 123 };
          expectedResult = service.addTeamsToCollectionIfMissing([], teams);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teams);
        });

        it('should not add a Teams to an array that contains it', () => {
          const teams: ITeams = { id: 123 };
          const teamsCollection: ITeams[] = [
            {
              ...teams,
            },
            { id: 456 },
          ];
          expectedResult = service.addTeamsToCollectionIfMissing(teamsCollection, teams);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Teams to an array that doesn't contain it", () => {
          const teams: ITeams = { id: 123 };
          const teamsCollection: ITeams[] = [{ id: 456 }];
          expectedResult = service.addTeamsToCollectionIfMissing(teamsCollection, teams);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teams);
        });

        it('should add only unique Teams to an array', () => {
          const teamsArray: ITeams[] = [{ id: 123 }, { id: 456 }, { id: 24216 }];
          const teamsCollection: ITeams[] = [{ id: 123 }];
          expectedResult = service.addTeamsToCollectionIfMissing(teamsCollection, ...teamsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const teams: ITeams = { id: 123 };
          const teams2: ITeams = { id: 456 };
          expectedResult = service.addTeamsToCollectionIfMissing([], teams, teams2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teams);
          expect(expectedResult).toContain(teams2);
        });

        it('should accept null and undefined values', () => {
          const teams: ITeams = { id: 123 };
          expectedResult = service.addTeamsToCollectionIfMissing([], null, teams, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teams);
        });

        it('should return initial array if no Teams is added', () => {
          const teamsCollection: ITeams[] = [{ id: 123 }];
          expectedResult = service.addTeamsToCollectionIfMissing(teamsCollection, undefined, null);
          expect(expectedResult).toEqual(teamsCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
