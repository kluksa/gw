import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface IPayroll {
  id?: number;
  effectiveDate?: dayjs.Dayjs | null;
  amountTotal?: number | null;
  amountNet?: number | null;
  employee?: IEmployee | null;
}

export class Payroll implements IPayroll {
  constructor(
    public id?: number,
    public effectiveDate?: dayjs.Dayjs | null,
    public amountTotal?: number | null,
    public amountNet?: number | null,
    public employee?: IEmployee | null
  ) {}
}

export function getPayrollIdentifier(payroll: IPayroll): number | undefined {
  return payroll.id;
}
