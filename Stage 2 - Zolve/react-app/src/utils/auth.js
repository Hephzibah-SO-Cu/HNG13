// src/utils/auth.js
const SESSION_KEY = 'ticketapp_session';
const USERS_KEY = 'zolve_users'; // mock users store

// helper: decode token to email (token is btoa(email))
export const getCurrentUserEmail = () => {
  try {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return null;
    return atob(token);
  } catch (e) {
    return null;
  }
};

// Get stored users or init with default
const getUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [{ email: 'user@zolve.com', password: 'zolve123' }];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const dispatchAuthChange = () => {
  // custom event so same-tab listeners update immediately
  try {
    window.dispatchEvent(new CustomEvent('authchange', { detail: { at: Date.now() } }));
  } catch (e) {
    // fallback - do nothing
  }
};

export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(SESSION_KEY, btoa(email));
    // notify same-tab listeners
    dispatchAuthChange();
    return { success: true };
  }
  return { success: false, error: 'Invalid email or password' };
};

export const signup = (email, password) => {
  const users = getUsers();
  if (users.some(u => u.email === email)) {
    return { success: false, error: 'Email already exists' };
  }
  const newUsers = [...users, { email, password }];
  saveUsers(newUsers);
  return { success: true };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(SESSION_KEY);
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
  dispatchAuthChange();
};
