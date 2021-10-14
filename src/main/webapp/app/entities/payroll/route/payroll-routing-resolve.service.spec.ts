jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPayroll, Payroll } from '../payroll.model';
import { PayrollService } from '../service/payroll.service';

import { PayrollRoutingResolveService } from './payroll-routing-resolve.service';

describe('Service Tests', () => {
  describe('Payroll routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PayrollRoutingResolveService;
    let service: PayrollService;
    let resultPayroll: IPayroll | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PayrollRoutingResolveService);
      service = TestBed.inject(PayrollService);
      resultPayroll = undefined;
    });

    describe('resolve', () => {
      it('should return IPayroll returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPayroll = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPayroll).toEqual({ id: 123 });
      });

      it('should return new IPayroll if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPayroll = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPayroll).toEqual(new Payroll());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Payroll })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPayroll = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPayroll).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
