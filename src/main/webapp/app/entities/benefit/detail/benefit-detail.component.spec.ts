import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BenefitDetailComponent } from './benefit-detail.component';

describe('Component Tests', () => {
  describe('Benefit Management Detail Component', () => {
    let comp: BenefitDetailComponent;
    let fixture: ComponentFixture<BenefitDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BenefitDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ benefit: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BenefitDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BenefitDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load benefit on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.benefit).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
