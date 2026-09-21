const STORAGE_KEY_TOKEN = 'commodity_greeks_auth_token';

/**
 * A wrapper around native fetch that automatically injects the JWT token
 * from localStorage if one exists.
 */
export const fetchWithAuth = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const token = localStorage.getItem(STORAGE_KEY_TOKEN);
  
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  return response;
};
