const STORAGE_KEY = 'zolve_tickets';

export const getTickets = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTickets = (tickets) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const validateTicket = (ticket) => {
  const errors = {};
  if (!ticket.title?.trim()) errors.title = 'Title is required';
  if (!['open', 'in_progress', 'closed'].includes(ticket.status)) {
    errors.status = 'Status must be open, in_progress, or closed';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};