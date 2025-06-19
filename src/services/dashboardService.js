// src/services/dashboardService.js
import { getDefaultStore } from 'jotai';
import { userAtom } from '@/store/atoms';
import { apiFetch } from '@/lib/api';

export async function fetchDashboardOverview() {
  const store = getDefaultStore();
  const user = store.get(userAtom);
  const restaurantId = user?.restaurantId;

  if (!restaurantId) throw new Error('Missing restaurantId');

  return await apiFetch(`/dashboard/overview/${restaurantId}`);
}

