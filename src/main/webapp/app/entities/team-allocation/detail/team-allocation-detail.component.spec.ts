import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TeamAllocationDetailComponent } from './team-allocation-detail.component';

describe('Component Tests', () => {
  describe('TeamAllocation Management Detail Component', () => {
    let comp: TeamAllocationDetailComponent;
    let fixture: ComponentFixture<TeamAllocationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TeamAllocationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ teamAllocation: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TeamAllocationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TeamAllocationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load teamAllocation on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.teamAllocation).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
