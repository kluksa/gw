import * as dayjs from 'dayjs';
import { IEmployee } from 'app/entities/employee/employee.model';

export interface INotes {
  id?: number;
  timestamp?: dayjs.Dayjs | null;
  note?: string | null;
  employee?: IEmployee | null;
}

export class Notes implements INotes {
  constructor(public id?: number, public timestamp?: dayjs.Dayjs | null, public note?: string | null, public employee?: IEmployee | null) {}
}

export function getNotesIdentifier(notes: INotes): number | undefined {
  return notes.id;
}
