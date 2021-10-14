import * as dayjs from 'dayjs';
import { IProjects } from 'app/entities/projects/projects.model';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IProjectAllocation {
  id?: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  note?: string | null;
  project?: IProjects | null;
  member?: IEmployee | null;
}

export class ProjectAllocation implements IProjectAllocation {
  constructor(
    public id?: number,
    public start?: dayjs.Dayjs | null,
    public end?: dayjs.Dayjs | null,
    public note?: string | null,
    public project?: IProjects | null,
    public member?: IEmployee | null
  ) {}
}

export function getProjectAllocationIdentifier(projectAllocation: IProjectAllocation): number | undefined {
  return projectAllocation.id;
}
