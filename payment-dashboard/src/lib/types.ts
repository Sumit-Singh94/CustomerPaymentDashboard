export type Status = 'Open' | 'Inactive' | 'Paid' | 'Due';

export interface Customer {
  id: string;
  name: string;
  description: string;
  status: Status;
  rate: number;
  balance: number;
  deposit: number;
}