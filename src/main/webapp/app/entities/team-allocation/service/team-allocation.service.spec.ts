import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITeamAllocation, TeamAllocation } from '../team-allocation.model';

import { TeamAllocationService } from './team-allocation.service';

describe('Service Tests', () => {
  describe('TeamAllocation Service', () => {
    let service: TeamAllocationService;
    let httpMock: HttpTestingController;
    let elemDefault: ITeamAllocation;
    let expectedResult: ITeamAllocation | ITeamAllocation[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TeamAllocationService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        start: currentDate,
        end: currentDate,
        note: 'AAAAAAA',
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

      it('should create a TeamAllocation', () => {
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

        service.create(new TeamAllocation()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a TeamAllocation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
            note: 'BBBBBB',
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

      it('should partial update a TeamAllocation', () => {
        const patchObject = Object.assign(
          {
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
          },
          new TeamAllocation()
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

      it('should return a list of TeamAllocation', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
            note: 'BBBBBB',
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

      it('should delete a TeamAllocation', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTeamAllocationToCollectionIfMissing', () => {
        it('should add a TeamAllocation to an empty array', () => {
          const teamAllocation: ITeamAllocation = { id: 123 };
          expectedResult = service.addTeamAllocationToCollectionIfMissing([], teamAllocation);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teamAllocation);
        });

        it('should not add a TeamAllocation to an array that contains it', () => {
          const teamAllocation: ITeamAllocation = { id: 123 };
          const teamAllocationCollection: ITeamAllocation[] = [
            {
              ...teamAllocation,
            },
            { id: 456 },
          ];
          expectedResult = service.addTeamAllocationToCollectionIfMissing(teamAllocationCollection, teamAllocation);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a TeamAllocation to an array that doesn't contain it", () => {
          const teamAllocation: ITeamAllocation = { id: 123 };
          const teamAllocationCollection: ITeamAllocation[] = [{ id: 456 }];
          expectedResult = service.addTeamAllocationToCollectionIfMissing(teamAllocationCollection, teamAllocation);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teamAllocation);
        });

        it('should add only unique TeamAllocation to an array', () => {
          const teamAllocationArray: ITeamAllocation[] = [{ id: 123 }, { id: 456 }, { id: 72529 }];
          const teamAllocationCollection: ITeamAllocation[] = [{ id: 123 }];
          expectedResult = service.addTeamAllocationToCollectionIfMissing(teamAllocationCollection, ...teamAllocationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const teamAllocation: ITeamAllocation = { id: 123 };
          const teamAllocation2: ITeamAllocation = { id: 456 };
          expectedResult = service.addTeamAllocationToCollectionIfMissing([], teamAllocation, teamAllocation2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(teamAllocation);
          expect(expectedResult).toContain(teamAllocation2);
        });

        it('should accept null and undefined values', () => {
          const teamAllocation: ITeamAllocation = { id: 123 };
          expectedResult = service.addTeamAllocationToCollectionIfMissing([], null, teamAllocation, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(teamAllocation);
        });

        it('should return initial array if no TeamAllocation is added', () => {
          const teamAllocationCollection: ITeamAllocation[] = [{ id: 123 }];
          expectedResult = service.addTeamAllocationToCollectionIfMissing(teamAllocationCollection, undefined, null);
          expect(expectedResult).toEqual(teamAllocationCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
