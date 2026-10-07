import { User, AnalysisResult } from '../types';

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export async function loginUser(
  email: string,
  password: string,
  rememberMe = false
): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Failed to sign in.' };
    }
    if (data.token) {
      localStorage.setItem('skinsense_auth_token', data.token);
    }
    return { success: true, user: data.user, token: data.token };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Network error during sign in.' };
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Registration failed.' };
    }
    if (data.token) {
      localStorage.setItem('skinsense_auth_token', data.token);
    }
    return { success: true, user: data.user, token: data.token };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Network error during registration.' };
  }
}

export async function loginWithGoogle(): Promise<AuthResponse> {
  try {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Elena Rostova',
        email: 'elena.rostova@google.com',
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Google sign in failed.' };
    }
    if (data.token) {
      localStorage.setItem('skinsense_auth_token', data.token);
    }
    return { success: true, user: data.user, token: data.token };
  } catch (err: unknown) {
    return { success: false, error: (err as Error).message || 'Google authentication error.' };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = localStorage.getItem('skinsense_auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/auth/me', { headers });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    localStorage.removeItem('skinsense_auth_token');
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch {
    // ignore
  }
}

export async function getUserHistory(): Promise<AnalysisResult[]> {
  try {
    const token = localStorage.getItem('skinsense_auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch('/api/user/history', { headers });
    if (!res.ok) return [];
    const data = await res.json();
    return data.history || [];
  } catch {
    return [];
  }
}

export async function saveUserScanHistory(scan: AnalysisResult): Promise<void> {
  try {
    const token = localStorage.getItem('skinsense_auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    await fetch('/api/user/history', {
      method: 'POST',
      headers,
      body: JSON.stringify({ scan }),
    });
  } catch {
    // ignore
  }
}
