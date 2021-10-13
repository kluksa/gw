import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProjectAllocationService } from '../service/project-allocation.service';

import { ProjectAllocationComponent } from './project-allocation.component';

describe('Component Tests', () => {
  describe('ProjectAllocation Management Component', () => {
    let comp: ProjectAllocationComponent;
    let fixture: ComponentFixture<ProjectAllocationComponent>;
    let service: ProjectAllocationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProjectAllocationComponent],
      })
        .overrideTemplate(ProjectAllocationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProjectAllocationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProjectAllocationService);

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
      expect(comp.projectAllocations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
