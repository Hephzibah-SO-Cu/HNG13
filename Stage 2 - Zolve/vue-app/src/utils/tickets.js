// vue-app/src/utils/tickets.js
const SESSION_KEY = 'ticketapp_session';

/**
 * Tickets are stored per-user in sessionStorage under key:
 *   zolve_tickets_<b64(email)>
 *
 * This prevents a global 'zolve_tickets' key appearing in localStorage.
 * sessionStorage chosen so only the current browser tab retains them (cleared on close).
 */

const getUserStorageKey = () => {
  const token = localStorage.getItem(SESSION_KEY);
  if (!token) return null;
  // token is btoa(email)
  const email = atob(token);
  return `zolve_tickets_${btoa(email)}`;
};

export const getTickets = () => {
  const key = getUserStorageKey();
  if (!key) return [];
  const data = sessionStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveTickets = (tickets) => {
  const key = getUserStorageKey();
  if (!key) return;
  sessionStorage.setItem(key, JSON.stringify(tickets));
};

export const validateTicket = (ticket) => {
  const errors = {};
  if (!ticket.title?.trim()) errors.title = 'Title is required';
  if (!['open', 'in_progress', 'closed'].includes(ticket.status)) {
    errors.status = 'Status must be open, in_progress, or closed';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
