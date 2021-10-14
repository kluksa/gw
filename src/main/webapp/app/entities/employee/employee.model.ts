import * as dayjs from 'dayjs';

export interface IEmployee {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: dayjs.Dayjs | null;
}

export class Employee implements IEmployee {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public dateOfBirth?: dayjs.Dayjs | null
  ) {}
}

export function getEmployeeIdentifier(employee: IEmployee): number | undefined {
  return employee.id;
}
