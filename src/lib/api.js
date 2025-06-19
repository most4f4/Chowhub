// src/lib/api.js

// Base URL for API requests, loaded from environment variable.
// NEXT_PUBLIC_API_URL should be defined in your .env.local file like:
// NEXT_PUBLIC_API_URL="http://localhost:8080/api/"
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

import { getDefaultStore } from 'jotai';
import { tokenAtom, userAtom } from '@/store/atoms';
import { toast } from 'react-toastify';

/**
 * A generic helper for making API requests.
 * On a 401 it clears auth state, notifies, and redirects home.
 */
export const apiFetch = async (path, options = {}) => {
  const store = getDefaultStore();
  let token = store.get(tokenAtom);

  // Clean the token by removing any extra quotes or backslashes
  if (token) {
    token = token.replace(/["\\]+/g, '');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const result = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      // 1) Clear auth in Jotai + localStorage
      store.set(tokenAtom, null);
      store.set(userAtom, null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // 2) Notify the user
      toast.error('Session expired, please log in again.');
      // 3) Redirect out of dashboard
      window.location.href = '/login';
    }
    throw new Error(result.error || 'API Error');
  }

  return result;
};