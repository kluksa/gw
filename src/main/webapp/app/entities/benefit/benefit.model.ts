import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IBenefit {
  id?: number;
  type?: string | null;
  effectiveDate?: dayjs.Dayjs | null;
  value?: number | null;
  endDate?: dayjs.Dayjs | null;
  employee?: IEmployee | null;
}

export class Benefit implements IBenefit {
  constructor(
    public id?: number,
    public type?: string | null,
    public effectiveDate?: dayjs.Dayjs | null,
    public value?: number | null,
    public endDate?: dayjs.Dayjs | null,
    public employee?: IEmployee | null
  ) {}
}

export function getBenefitIdentifier(benefit: IBenefit): number | undefined {
  return benefit.id;
}
