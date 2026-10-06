// Backend base URL. Set VITE_API_URL in .env (local) or in your hosting provider (production).
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
