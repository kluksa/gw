import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TeamsService } from '../service/teams.service';

import { TeamsComponent } from './teams.component';

describe('Component Tests', () => {
  describe('Teams Management Component', () => {
    let comp: TeamsComponent;
    let fixture: ComponentFixture<TeamsComponent>;
    let service: TeamsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TeamsComponent],
      })
        .overrideTemplate(TeamsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TeamsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TeamsService);

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
      expect(comp.teams?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
