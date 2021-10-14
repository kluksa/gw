import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TeamAllocationService } from '../service/team-allocation.service';

import { TeamAllocationComponent } from './team-allocation.component';

describe('Component Tests', () => {
  describe('TeamAllocation Management Component', () => {
    let comp: TeamAllocationComponent;
    let fixture: ComponentFixture<TeamAllocationComponent>;
    let service: TeamAllocationService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TeamAllocationComponent],
      })
        .overrideTemplate(TeamAllocationComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TeamAllocationComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TeamAllocationService);

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
      expect(comp.teamAllocations?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
