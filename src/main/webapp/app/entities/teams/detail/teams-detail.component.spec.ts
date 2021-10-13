import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TeamsDetailComponent } from './teams-detail.component';

describe('Component Tests', () => {
  describe('Teams Management Detail Component', () => {
    let comp: TeamsDetailComponent;
    let fixture: ComponentFixture<TeamsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TeamsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ teams: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TeamsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TeamsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load teams on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.teams).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
