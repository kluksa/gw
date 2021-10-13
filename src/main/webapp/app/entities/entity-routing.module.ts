import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'employee',
        data: { pageTitle: 'gwApp.employee.home.title' },
        loadChildren: () => import('./employee/employee.module').then(m => m.EmployeeModule),
      },
      {
        path: 'payroll',
        data: { pageTitle: 'gwApp.payroll.home.title' },
        loadChildren: () => import('./payroll/payroll.module').then(m => m.PayrollModule),
      },
      {
        path: 'bonus',
        data: { pageTitle: 'gwApp.bonus.home.title' },
        loadChildren: () => import('./bonus/bonus.module').then(m => m.BonusModule),
      },
      {
        path: 'benefit',
        data: { pageTitle: 'gwApp.benefit.home.title' },
        loadChildren: () => import('./benefit/benefit.module').then(m => m.BenefitModule),
      },
      {
        path: 'notes',
        data: { pageTitle: 'gwApp.notes.home.title' },
        loadChildren: () => import('./notes/notes.module').then(m => m.NotesModule),
      },
      {
        path: 'teams',
        data: { pageTitle: 'gwApp.teams.home.title' },
        loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule),
      },
      {
        path: 'team-allocation',
        data: { pageTitle: 'gwApp.teamAllocation.home.title' },
        loadChildren: () => import('./team-allocation/team-allocation.module').then(m => m.TeamAllocationModule),
      },
      {
        path: 'projects',
        data: { pageTitle: 'gwApp.projects.home.title' },
        loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule),
      },
      {
        path: 'project-allocation',
        data: { pageTitle: 'gwApp.projectAllocation.home.title' },
        loadChildren: () => import('./project-allocation/project-allocation.module').then(m => m.ProjectAllocationModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
