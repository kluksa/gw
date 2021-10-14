import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface ITeams {
  id?: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  leader?: IEmployee | null;
}

export class Teams implements ITeams {
  constructor(public id?: number, public start?: dayjs.Dayjs | null, public end?: dayjs.Dayjs | null, public leader?: IEmployee | null) {}
}

export function getTeamsIdentifier(teams: ITeams): number | undefined {
  return teams.id;
}
