import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { NotesService } from '../service/notes.service';

import { NotesComponent } from './notes.component';

describe('Component Tests', () => {
  describe('Notes Management Component', () => {
    let comp: NotesComponent;
    let fixture: ComponentFixture<NotesComponent>;
    let service: NotesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [NotesComponent],
      })
        .overrideTemplate(NotesComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(NotesComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(NotesService);

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
      expect(comp.notes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
