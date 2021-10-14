import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BenefitService } from '../service/benefit.service';

import { BenefitComponent } from './benefit.component';

describe('Component Tests', () => {
  describe('Benefit Management Component', () => {
    let comp: BenefitComponent;
    let fixture: ComponentFixture<BenefitComponent>;
    let service: BenefitService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BenefitComponent],
      })
        .overrideTemplate(BenefitComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BenefitComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BenefitService);

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
      expect(comp.benefits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
