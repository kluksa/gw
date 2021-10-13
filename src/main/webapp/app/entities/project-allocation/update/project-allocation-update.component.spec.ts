jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProjectAllocationService } from '../service/project-allocation.service';
import { IProjectAllocation, ProjectAllocation } from '../project-allocation.model';
import { IProjects } from 'app/entities/projects/projects.model';
import { ProjectsService } from 'app/entities/projects/service/projects.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { ProjectAllocationUpdateComponent } from './project-allocation-update.component';

describe('Component Tests', () => {
  describe('ProjectAllocation Management Update Component', () => {
    let comp: ProjectAllocationUpdateComponent;
    let fixture: ComponentFixture<ProjectAllocationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let projectAllocationService: ProjectAllocationService;
    let projectsService: ProjectsService;
    let employeeService: EmployeeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProjectAllocationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProjectAllocationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProjectAllocationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      projectAllocationService = TestBed.inject(ProjectAllocationService);
      projectsService = TestBed.inject(ProjectsService);
      employeeService = TestBed.inject(EmployeeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Projects query and add missing value', () => {
        const projectAllocation: IProjectAllocation = { id: 456 };
        const project: IProjects = { id: 17569 };
        projectAllocation.project = project;

        const projectsCollection: IProjects[] = [{ id: 51252 }];
        jest.spyOn(projectsService, 'query').mockReturnValue(of(new HttpResponse({ body: projectsCollection })));
        const additionalProjects = [project];
        const expectedCollection: IProjects[] = [...additionalProjects, ...projectsCollection];
        jest.spyOn(projectsService, 'addProjectsToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ projectAllocation });
        comp.ngOnInit();

        expect(projectsService.query).toHaveBeenCalled();
        expect(projectsService.addProjectsToCollectionIfMissing).toHaveBeenCalledWith(projectsCollection, ...additionalProjects);
        expect(comp.projectsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Employee query and add missing value', () => {
        const projectAllocation: IProjectAllocation = { id: 456 };
        const member: IEmployee = { id: 72695 };
        projectAllocation.member = member;

        const employeeCollection: IEmployee[] = [{ id: 44666 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const additionalEmployees = [member];
        const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ projectAllocation });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
        expect(comp.employeesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const projectAllocation: IProjectAllocation = { id: 456 };
        const project: IProjects = { id: 9870 };
        projectAllocation.project = project;
        const member: IEmployee = { id: 90469 };
        projectAllocation.member = member;

        activatedRoute.data = of({ projectAllocation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(projectAllocation));
        expect(comp.projectsSharedCollection).toContain(project);
        expect(comp.employeesSharedCollection).toContain(member);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ProjectAllocation>>();
        const projectAllocation = { id: 123 };
        jest.spyOn(projectAllocationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ projectAllocation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: projectAllocation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(projectAllocationService.update).toHaveBeenCalledWith(projectAllocation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ProjectAllocation>>();
        const projectAllocation = new ProjectAllocation();
        jest.spyOn(projectAllocationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ projectAllocation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: projectAllocation }));
        saveSubject.complete();

        // THEN
        expect(projectAllocationService.create).toHaveBeenCalledWith(projectAllocation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<ProjectAllocation>>();
        const projectAllocation = { id: 123 };
        jest.spyOn(projectAllocationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ projectAllocation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(projectAllocationService.update).toHaveBeenCalledWith(projectAllocation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProjectsById', () => {
        it('Should return tracked Projects primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProjectsById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
