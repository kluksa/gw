import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IProjects {
  id?: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  name?: string | null;
  note?: string | null;
  manager?: IEmployee | null;
}

export class Projects implements IProjects {
  constructor(
    public id?: number,
    public start?: dayjs.Dayjs | null,
    public end?: dayjs.Dayjs | null,
    public name?: string | null,
    public note?: string | null,
    public manager?: IEmployee | null
  ) {}
}

export function getProjectsIdentifier(projects: IProjects): number | undefined {
  return projects.id;
}
