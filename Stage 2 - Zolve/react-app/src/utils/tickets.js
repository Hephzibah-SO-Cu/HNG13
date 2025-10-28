// src/utils/tickets.js
import { getCurrentUserEmail } from './auth';

const STORAGE_KEY = 'zolve_tickets'; // global store of all tickets with owner field

// read full store (array of tickets with owner)
const _readAll = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// write full store
const _writeAll = (all) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
};

// returns tickets that belong to current user
export const getTickets = () => {
  const owner = getCurrentUserEmail();
  if (!owner) return [];
  const all = _readAll();
  return all.filter(t => t.owner === owner);
};

// saves the provided tickets *for the current user* while preserving others
export const saveTickets = (userTickets) => {
  const owner = getCurrentUserEmail();
  if (!owner) throw new Error('Not authenticated');

  const all = _readAll();
  // remove any tickets belonging to this owner
  const others = all.filter(t => t.owner !== owner);
  // ensure each saved ticket has owner field
  const toSave = userTickets.map(t => ({ ...t, owner }));
  _writeAll([...others, ...toSave]);
};

// validation
export const validateTicket = (ticket) => {
  const errors = {};
  if (!ticket.title || !ticket.title.trim()) errors.title = 'Title is required';
  if (!['open', 'in_progress', 'closed'].includes(ticket.status)) {
    errors.status = 'Status must be open, in_progress, or closed';
  }
  if (ticket.description && ticket.description.length > 500) {
    errors.description = 'Description too long (max 500 chars)';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
