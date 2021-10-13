import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProjectsService } from '../service/projects.service';

import { ProjectsComponent } from './projects.component';

describe('Component Tests', () => {
  describe('Projects Management Component', () => {
    let comp: ProjectsComponent;
    let fixture: ComponentFixture<ProjectsComponent>;
    let service: ProjectsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProjectsComponent],
      })
        .overrideTemplate(ProjectsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProjectsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProjectsService);

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
      expect(comp.projects?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
