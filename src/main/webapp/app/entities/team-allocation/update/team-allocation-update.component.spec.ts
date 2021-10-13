jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TeamAllocationService } from '../service/team-allocation.service';
import { ITeamAllocation, TeamAllocation } from '../team-allocation.model';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { ITeams } from 'app/entities/teams/teams.model';
import { TeamsService } from 'app/entities/teams/service/teams.service';

import { TeamAllocationUpdateComponent } from './team-allocation-update.component';

describe('Component Tests', () => {
  describe('TeamAllocation Management Update Component', () => {
    let comp: TeamAllocationUpdateComponent;
    let fixture: ComponentFixture<TeamAllocationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let teamAllocationService: TeamAllocationService;
    let employeeService: EmployeeService;
    let teamsService: TeamsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TeamAllocationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TeamAllocationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TeamAllocationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      teamAllocationService = TestBed.inject(TeamAllocationService);
      employeeService = TestBed.inject(EmployeeService);
      teamsService = TestBed.inject(TeamsService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Employee query and add missing value', () => {
        const teamAllocation: ITeamAllocation = { id: 456 };
        const member: IEmployee = { id: 37904 };
        teamAllocation.member = member;

        const employeeCollection: IEmployee[] = [{ id: 61041 }];
        jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
        const additionalEmployees = [member];
        const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
        jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ teamAllocation });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, ...additionalEmployees);
        expect(comp.employeesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Teams query and add missing value', () => {
        const teamAllocation: ITeamAllocation = { id: 456 };
        const team: ITeams = { id: 89273 };
        teamAllocation.team = team;

        const teamsCollection: ITeams[] = [{ id: 23968 }];
        jest.spyOn(teamsService, 'query').mockReturnValue(of(new HttpResponse({ body: teamsCollection })));
        const additionalTeams = [team];
        const expectedCollection: ITeams[] = [...additionalTeams, ...teamsCollection];
        jest.spyOn(teamsService, 'addTeamsToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ teamAllocation });
        comp.ngOnInit();

        expect(teamsService.query).toHaveBeenCalled();
        expect(teamsService.addTeamsToCollectionIfMissing).toHaveBeenCalledWith(teamsCollection, ...additionalTeams);
        expect(comp.teamsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const teamAllocation: ITeamAllocation = { id: 456 };
        const member: IEmployee = { id: 85523 };
        teamAllocation.member = member;
        const team: ITeams = { id: 50027 };
        teamAllocation.team = team;

        activatedRoute.data = of({ teamAllocation });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(teamAllocation));
        expect(comp.employeesSharedCollection).toContain(member);
        expect(comp.teamsSharedCollection).toContain(team);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TeamAllocation>>();
        const teamAllocation = { id: 123 };
        jest.spyOn(teamAllocationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ teamAllocation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: teamAllocation }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(teamAllocationService.update).toHaveBeenCalledWith(teamAllocation);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TeamAllocation>>();
        const teamAllocation = new TeamAllocation();
        jest.spyOn(teamAllocationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ teamAllocation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: teamAllocation }));
        saveSubject.complete();

        // THEN
        expect(teamAllocationService.create).toHaveBeenCalledWith(teamAllocation);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<TeamAllocation>>();
        const teamAllocation = { id: 123 };
        jest.spyOn(teamAllocationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ teamAllocation });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(teamAllocationService.update).toHaveBeenCalledWith(teamAllocation);
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

      describe('trackTeamsById', () => {
        it('Should return tracked Teams primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTeamsById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
