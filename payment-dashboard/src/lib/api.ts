import type { Customer } from './types';

const STORAGE_KEY = 'payment_dashboard_data';

const INITIAL_DATA: Customer[] = [
  { id: '1', name: 'John Doe', description: 'Web Dev Project', status: 'Paid', rate: 85.00, balance: 0.00, deposit: 500.00 },
  { id: '2', name: 'Sarah Smith', description: 'SEO Audit', status: 'Open', rate: 120.00, balance: 350.00, deposit: 100.00 },
  { id: '3', name: 'Michael Brown', description: 'Mobile App UI', status: 'Due', rate: 95.00, balance: 1200.00, deposit: 0.00 },
  { id: '4', name: 'Emma Wilson', description: 'Consulting', status: 'Inactive', rate: 200.00, balance: 0.00, deposit: 0.00 },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchCustomers = async (): Promise<Customer[]> => {
  await delay(500); // Simulate network
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(stored);
};

export const saveCustomer = async (customer: Customer): Promise<Customer> => {
  await delay(500);
  const customers = await fetchCustomers();
  const exists = customers.find(c => c.id === customer.id);
  
  let newList;
  if (exists) {
    newList = customers.map(c => c.id === customer.id ? customer : c);
  } else {
    newList = [customer, ...customers];
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  return customer;
};

export const deleteCustomers = async (ids: string[]): Promise<void> => {
  await delay(500);
  const customers = await fetchCustomers();
  const newList = customers.filter(c => !ids.includes(c.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
};