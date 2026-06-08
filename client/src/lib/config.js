/** API base without /api suffix — empty in dev (Vite proxy handles it) */
export const API_ORIGIN = import.meta.env.VITE_API_URL || '';

export const API_BASE = API_ORIGIN ? `${API_ORIGIN}/api` : '/api';
