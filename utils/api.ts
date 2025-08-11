export const API_URL = '/api';

export const ApiReq = async (url: string, options: RequestInit = {}) => {
    return fetch(`${API_URL}${url}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  };
  