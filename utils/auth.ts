export interface AuthPayload {
  username: string;
  usergroup: string;
  admin: boolean;
  exp?: number;
}

export function decodeSessToken(): AuthPayload | null {
  try {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sess='));

    if (!cookie) return null;

    const value = atob(cookie.split('=')[1]);

    return JSON.parse(value) as AuthPayload;
  } catch (err) {
    console.error('Ошибка при чтении sess cookie:', err);
    return null;
  }
}