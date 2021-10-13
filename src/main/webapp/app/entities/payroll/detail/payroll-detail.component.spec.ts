import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PayrollDetailComponent } from './payroll-detail.component';

describe('Component Tests', () => {
  describe('Payroll Management Detail Component', () => {
    let comp: PayrollDetailComponent;
    let fixture: ComponentFixture<PayrollDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PayrollDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ payroll: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PayrollDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PayrollDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load payroll on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.payroll).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
