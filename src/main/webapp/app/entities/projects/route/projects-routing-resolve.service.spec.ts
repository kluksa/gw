jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProjects, Projects } from '../projects.model';
import { ProjectsService } from '../service/projects.service';

import { ProjectsRoutingResolveService } from './projects-routing-resolve.service';

describe('Service Tests', () => {
  describe('Projects routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProjectsRoutingResolveService;
    let service: ProjectsService;
    let resultProjects: IProjects | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProjectsRoutingResolveService);
      service = TestBed.inject(ProjectsService);
      resultProjects = undefined;
    });

    describe('resolve', () => {
      it('should return IProjects returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProjects = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProjects).toEqual({ id: 123 });
      });

      it('should return new IProjects if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProjects = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProjects).toEqual(new Projects());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Projects })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProjects = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProjects).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
