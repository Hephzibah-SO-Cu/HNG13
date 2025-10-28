// vue-app/src/utils/auth.js
const SESSION_KEY = 'ticketapp_session';
const USERS_KEY = 'zolve_users'; // now stored in sessionStorage (not localStorage)

/**
 * Users stored in sessionStorage so they are not permanently visible in localStorage.
 * For the frontend task this is acceptable; if you want persistence across browser restarts
 * we can encrypt & keep per-user keys in localStorage instead.
 */
const getUsers = () => {
  const data = sessionStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [{ email: 'user@zolve.com', password: 'zolve123' }];
};

const saveUsers = (users) => {
  sessionStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    // Persist only the session token in localStorage so storage events work across tabs
    localStorage.setItem(SESSION_KEY, btoa(email));
    // notify app slices that use window event
    window.dispatchEvent(new Event('authChange'));
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
  // Auto-login: set ticket token
  localStorage.setItem(SESSION_KEY, btoa(email));
  window.dispatchEvent(new Event('authChange'));
  return { success: true };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(SESSION_KEY);
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('authChange'));
};

/**
 * Helpful helper to get current logged-in email (decoded)
 */
export const getCurrentEmailFromSession = () => {
  const token = localStorage.getItem(SESSION_KEY);
  return token ? atob(token) : null;
};
