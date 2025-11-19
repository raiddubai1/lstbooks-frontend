export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const logout = () => {
  removeAuthToken();
  removeUser();
};

// Role-based helper functions
export const getUserRole = () => {
  const user = getUser();
  return user?.role || 'student';
};

export const isStudent = () => {
  return getUserRole() === 'student';
};

export const isTeacher = () => {
  return getUserRole() === 'teacher';
};

export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const canManageContent = () => {
  const role = getUserRole();
  return role === 'teacher' || role === 'admin';
};

export const canManageUsers = () => {
  return isAdmin();
};

