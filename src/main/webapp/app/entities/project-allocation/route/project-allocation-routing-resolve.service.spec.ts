jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProjectAllocation, ProjectAllocation } from '../project-allocation.model';
import { ProjectAllocationService } from '../service/project-allocation.service';

import { ProjectAllocationRoutingResolveService } from './project-allocation-routing-resolve.service';

describe('Service Tests', () => {
  describe('ProjectAllocation routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProjectAllocationRoutingResolveService;
    let service: ProjectAllocationService;
    let resultProjectAllocation: IProjectAllocation | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProjectAllocationRoutingResolveService);
      service = TestBed.inject(ProjectAllocationService);
      resultProjectAllocation = undefined;
    });

    describe('resolve', () => {
      it('should return IProjectAllocation returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProjectAllocation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProjectAllocation).toEqual({ id: 123 });
      });

      it('should return new IProjectAllocation if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProjectAllocation = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProjectAllocation).toEqual(new ProjectAllocation());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as ProjectAllocation })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProjectAllocation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProjectAllocation).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
