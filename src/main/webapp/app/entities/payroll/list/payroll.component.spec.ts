import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PayrollService } from '../service/payroll.service';

import { PayrollComponent } from './payroll.component';

describe('Component Tests', () => {
  describe('Payroll Management Component', () => {
    let comp: PayrollComponent;
    let fixture: ComponentFixture<PayrollComponent>;
    let service: PayrollService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PayrollComponent],
      })
        .overrideTemplate(PayrollComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PayrollComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PayrollService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.payrolls?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
