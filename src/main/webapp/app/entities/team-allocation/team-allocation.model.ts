import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';
import { ITeams } from 'app/entities/teams/teams.model';

export interface ITeamAllocation {
  id?: number;
  start?: dayjs.Dayjs | null;
  end?: dayjs.Dayjs | null;
  note?: string | null;
  member?: IEmployee | null;
  team?: ITeams | null;
}

export class TeamAllocation implements ITeamAllocation {
  constructor(
    public id?: number,
    public start?: dayjs.Dayjs | null,
    public end?: dayjs.Dayjs | null,
    public note?: string | null,
    public member?: IEmployee | null,
    public team?: ITeams | null
  ) {}
}

export function getTeamAllocationIdentifier(teamAllocation: ITeamAllocation): number | undefined {
  return teamAllocation.id;
}
