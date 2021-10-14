import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProjectAllocation, ProjectAllocation } from '../project-allocation.model';

import { ProjectAllocationService } from './project-allocation.service';

describe('Service Tests', () => {
  describe('ProjectAllocation Service', () => {
    let service: ProjectAllocationService;
    let httpMock: HttpTestingController;
    let elemDefault: IProjectAllocation;
    let expectedResult: IProjectAllocation | IProjectAllocation[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProjectAllocationService);
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

      it('should create a ProjectAllocation', () => {
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

        service.create(new ProjectAllocation()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProjectAllocation', () => {
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

      it('should partial update a ProjectAllocation', () => {
        const patchObject = Object.assign(
          {
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
            note: 'BBBBBB',
          },
          new ProjectAllocation()
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

      it('should return a list of ProjectAllocation', () => {
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

      it('should delete a ProjectAllocation', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProjectAllocationToCollectionIfMissing', () => {
        it('should add a ProjectAllocation to an empty array', () => {
          const projectAllocation: IProjectAllocation = { id: 123 };
          expectedResult = service.addProjectAllocationToCollectionIfMissing([], projectAllocation);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(projectAllocation);
        });

        it('should not add a ProjectAllocation to an array that contains it', () => {
          const projectAllocation: IProjectAllocation = { id: 123 };
          const projectAllocationCollection: IProjectAllocation[] = [
            {
              ...projectAllocation,
            },
            { id: 456 },
          ];
          expectedResult = service.addProjectAllocationToCollectionIfMissing(projectAllocationCollection, projectAllocation);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ProjectAllocation to an array that doesn't contain it", () => {
          const projectAllocation: IProjectAllocation = { id: 123 };
          const projectAllocationCollection: IProjectAllocation[] = [{ id: 456 }];
          expectedResult = service.addProjectAllocationToCollectionIfMissing(projectAllocationCollection, projectAllocation);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(projectAllocation);
        });

        it('should add only unique ProjectAllocation to an array', () => {
          const projectAllocationArray: IProjectAllocation[] = [{ id: 123 }, { id: 456 }, { id: 61957 }];
          const projectAllocationCollection: IProjectAllocation[] = [{ id: 123 }];
          expectedResult = service.addProjectAllocationToCollectionIfMissing(projectAllocationCollection, ...projectAllocationArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const projectAllocation: IProjectAllocation = { id: 123 };
          const projectAllocation2: IProjectAllocation = { id: 456 };
          expectedResult = service.addProjectAllocationToCollectionIfMissing([], projectAllocation, projectAllocation2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(projectAllocation);
          expect(expectedResult).toContain(projectAllocation2);
        });

        it('should accept null and undefined values', () => {
          const projectAllocation: IProjectAllocation = { id: 123 };
          expectedResult = service.addProjectAllocationToCollectionIfMissing([], null, projectAllocation, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(projectAllocation);
        });

        it('should return initial array if no ProjectAllocation is added', () => {
          const projectAllocationCollection: IProjectAllocation[] = [{ id: 123 }];
          expectedResult = service.addProjectAllocationToCollectionIfMissing(projectAllocationCollection, undefined, null);
          expect(expectedResult).toEqual(projectAllocationCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
