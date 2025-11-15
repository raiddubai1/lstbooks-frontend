import { useState, useEffect } from 'react';
import { getUser, isAuthenticated } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  return {
    user,
    isAuthenticated: isAuthenticated(),
    loading
  };
};

