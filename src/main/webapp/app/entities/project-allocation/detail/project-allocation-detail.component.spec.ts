import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProjectAllocationDetailComponent } from './project-allocation-detail.component';

describe('Component Tests', () => {
  describe('ProjectAllocation Management Detail Component', () => {
    let comp: ProjectAllocationDetailComponent;
    let fixture: ComponentFixture<ProjectAllocationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProjectAllocationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ projectAllocation: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProjectAllocationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProjectAllocationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load projectAllocation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.projectAllocation).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
