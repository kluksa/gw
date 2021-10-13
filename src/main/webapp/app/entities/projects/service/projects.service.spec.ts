import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IProjects, Projects } from '../projects.model';

import { ProjectsService } from './projects.service';

describe('Service Tests', () => {
  describe('Projects Service', () => {
    let service: ProjectsService;
    let httpMock: HttpTestingController;
    let elemDefault: IProjects;
    let expectedResult: IProjects | IProjects[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProjectsService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        start: currentDate,
        end: currentDate,
        name: 'AAAAAAA',
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

      it('should create a Projects', () => {
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

        service.create(new Projects()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Projects', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
            name: 'BBBBBB',
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

      it('should partial update a Projects', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            note: 'BBBBBB',
          },
          new Projects()
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

      it('should return a list of Projects', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            start: currentDate.format(DATE_FORMAT),
            end: currentDate.format(DATE_FORMAT),
            name: 'BBBBBB',
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

      it('should delete a Projects', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProjectsToCollectionIfMissing', () => {
        it('should add a Projects to an empty array', () => {
          const projects: IProjects = { id: 123 };
          expectedResult = service.addProjectsToCollectionIfMissing([], projects);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(projects);
        });

        it('should not add a Projects to an array that contains it', () => {
          const projects: IProjects = { id: 123 };
          const projectsCollection: IProjects[] = [
            {
              ...projects,
            },
            { id: 456 },
          ];
          expectedResult = service.addProjectsToCollectionIfMissing(projectsCollection, projects);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Projects to an array that doesn't contain it", () => {
          const projects: IProjects = { id: 123 };
          const projectsCollection: IProjects[] = [{ id: 456 }];
          expectedResult = service.addProjectsToCollectionIfMissing(projectsCollection, projects);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(projects);
        });

        it('should add only unique Projects to an array', () => {
          const projectsArray: IProjects[] = [{ id: 123 }, { id: 456 }, { id: 39925 }];
          const projectsCollection: IProjects[] = [{ id: 123 }];
          expectedResult = service.addProjectsToCollectionIfMissing(projectsCollection, ...projectsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const projects: IProjects = { id: 123 };
          const projects2: IProjects = { id: 456 };
          expectedResult = service.addProjectsToCollectionIfMissing([], projects, projects2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(projects);
          expect(expectedResult).toContain(projects2);
        });

        it('should accept null and undefined values', () => {
          const projects: IProjects = { id: 123 };
          expectedResult = service.addProjectsToCollectionIfMissing([], null, projects, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(projects);
        });

        it('should return initial array if no Projects is added', () => {
          const projectsCollection: IProjects[] = [{ id: 123 }];
          expectedResult = service.addProjectsToCollectionIfMissing(projectsCollection, undefined, null);
          expect(expectedResult).toEqual(projectsCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
