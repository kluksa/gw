import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IBonus {
  id?: number;
  effectiveDate?: dayjs.Dayjs | null;
  amount?: number | null;
  note?: string | null;
  employee?: IEmployee | null;
}

export class Bonus implements IBonus {
  constructor(
    public id?: number,
    public effectiveDate?: dayjs.Dayjs | null,
    public amount?: number | null,
    public note?: string | null,
    public employee?: IEmployee | null
  ) {}
}

export function getBonusIdentifier(bonus: IBonus): number | undefined {
  return bonus.id;
}
