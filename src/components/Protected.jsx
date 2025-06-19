import { useEffect, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { tokenAtom, userAtom } from '@/store/atoms';

/**
 * Wrap any dashboard page in <Protected>…</Protected>
 * - Loads token and user from localStorage on mount
 * - If no token or no user after initialization → clears auth & redirects to /login
 * - If on a mismatched restaurantUsername URL → sends to correct dashboard
 */
export default function Protected({ children }) {
  const router = useRouter();
  const { restaurantUsername } = router.query;
  const setToken = useSetAtom(tokenAtom);
  const setUser = useSetAtom(userAtom);
  const token = useAtomValue(tokenAtom);
  const user = useAtomValue(userAtom);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load authentication data from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        setToken(null);
        setUser(null);
      }
    }
    setIsInitialized(true);
  }, [setToken, setUser]);

  // Handle redirects after initialization
  useEffect(() => {
    if (!isInitialized) return;

    // 1) Not logged in or user info not set → clear & send to login
    if (!token || !user) {
      setToken(null);
      setUser(null);
      router.replace('/login');
      return;
    }

    // 2) Wrong restaurantUsername in URL → redirect to their own dashboard
    if (
      restaurantUsername &&
      user.restaurantUsername &&
      restaurantUsername !== user.restaurantUsername
    ) {
      router.replace(`/${user.restaurantUsername}/dashboard`);
    }
  }, [isInitialized, token, user, restaurantUsername, router, setToken, setUser]);

  // Render logic
  if (!isInitialized) {
    return <div>Loading...</div>; // Display loading state during initialization
  }

  if (!token || !user) {
    return null; // Redirect is handled in useEffect
  }

  return children; // Render protected content
}

/**
 * Wrap pages that only managers may see.
 */
export function ManagerOnly({ children }) {
  const user = useAtomValue(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'manager') {
      router.replace('/unauthorized');
    }
  }, [user, router]);

  return user?.role === 'manager' ? children : null;
}