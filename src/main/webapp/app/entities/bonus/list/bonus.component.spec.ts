import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BonusService } from '../service/bonus.service';

import { BonusComponent } from './bonus.component';

describe('Component Tests', () => {
  describe('Bonus Management Component', () => {
    let comp: BonusComponent;
    let fixture: ComponentFixture<BonusComponent>;
    let service: BonusService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BonusComponent],
      })
        .overrideTemplate(BonusComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BonusComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BonusService);

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
      expect(comp.bonuses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
