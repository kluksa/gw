import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjectsDetailComponent } from './projects-detail.component';

describe('Component Tests', () => {
  describe('Projects Management Detail Component', () => {
    let comp: ProjectsDetailComponent;
    let fixture: ComponentFixture<ProjectsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProjectsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ projects: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProjectsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProjectsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load projects on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.projects).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
