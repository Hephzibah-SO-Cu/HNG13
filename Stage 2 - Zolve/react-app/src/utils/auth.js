const SESSION_KEY = 'ticketapp_session';
const USERS_KEY = 'zolve_users'; // New: Store mock users

// Get stored users or init with default
const getUsers = () => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [{ email: 'user@zolve.com', password: 'zolve123' }]; // Default test user
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(SESSION_KEY, btoa(email)); // Token based on email
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
};