jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITeamAllocation, TeamAllocation } from '../team-allocation.model';
import { TeamAllocationService } from '../service/team-allocation.service';

import { TeamAllocationRoutingResolveService } from './team-allocation-routing-resolve.service';

describe('Service Tests', () => {
  describe('TeamAllocation routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TeamAllocationRoutingResolveService;
    let service: TeamAllocationService;
    let resultTeamAllocation: ITeamAllocation | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TeamAllocationRoutingResolveService);
      service = TestBed.inject(TeamAllocationService);
      resultTeamAllocation = undefined;
    });

    describe('resolve', () => {
      it('should return ITeamAllocation returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeamAllocation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTeamAllocation).toEqual({ id: 123 });
      });

      it('should return new ITeamAllocation if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeamAllocation = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTeamAllocation).toEqual(new TeamAllocation());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as TeamAllocation })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTeamAllocation = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTeamAllocation).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
