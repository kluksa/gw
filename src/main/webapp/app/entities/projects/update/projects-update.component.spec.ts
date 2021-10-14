jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProjectsService } from '../service/projects.service';
import { IProjects, Projects } from '../projects.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { ProjectsUpdateComponent } from './projects-update.component';

describe('Component Tests', () => {
  describe('Projects Management Update Component', () => {
    let comp: ProjectsUpdateComponent;
    let fixture: ComponentFixture<ProjectsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let projectsService: ProjectsService;
    let employeeService: EmployeeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProjectsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProjectsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProjectsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      projectsService = TestBed.inject(ProjectsService);
      employeeService = TestBed.inject(EmployeeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Employee query and add missing value', () => {
        const projects: IProjects = { id: 456 };
        const manager: IEmployee = { id: 49494 };
        projects.manager = manager;

        const employeeCollection: IEmployee[] = [{ id: 62291 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const additionalEmployees = [manager];
        const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ projects });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
        expect(comp.employeesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const projects: IProjects = { id: 456 };
        const manager: IEmployee = { id: 70364 };
        projects.manager = manager;

        activatedRoute.data = of({ projects });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(projects));
        expect(comp.employeesSharedCollection).toContain(manager);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Projects>>();
        const projects = { id: 123 };
        jest.spyOn(projectsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ projects });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: projects }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(projectsService.update).toHaveBeenCalledWith(projects);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Projects>>();
        const projects = new Projects();
        jest.spyOn(projectsService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ projects });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: projects }));
        saveSubject.complete();

        // THEN
        expect(projectsService.create).toHaveBeenCalledWith(projects);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Projects>>();
        const projects = { id: 123 };
        jest.spyOn(projectsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ projects });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(projectsService.update).toHaveBeenCalledWith(projects);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmployeeById', () => {
        it('Should return tracked Employee primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackEmployeeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
