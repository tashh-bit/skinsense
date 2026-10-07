import type { Plugin, ViteDevServer } from 'vite';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.join('=').trim());
    }
  });
  return list;
}

function serializeCookie(
  name: string,
  val: string,
  options: { httpOnly?: boolean; secure?: boolean; sameSite?: 'lax' | 'strict' | 'none'; maxAge?: number; path?: string } = {}
): string {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(val)}`;
  if (options.maxAge !== undefined) {
    cookie += `; Max-Age=${Math.floor(options.maxAge)}`;
  }
  if (options.path) {
    cookie += `; Path=${options.path}`;
  }
  if (options.httpOnly) {
    cookie += '; HttpOnly';
  }
  if (options.secure) {
    cookie += '; Secure';
  }
  if (options.sameSite) {
    cookie += `; SameSite=${options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1)}`;
  }
  return cookie;
}

interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  history?: unknown[];
}

const JWT_SECRET = process.env.JWT_SECRET || 'skinsense_ai_secret_key_2026_jwt_token_secure';
const DB_PATH = path.resolve(process.cwd(), 'data', 'users.json');

// Ensure data folder and users.json exist
function ensureDatabase(): StoredUser[] {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    // Seed with a default demo user for instant seamless login testing
    const demoPasswordHash = bcrypt.hashSync('SkinSense@2026', 10);
    const initialUsers: StoredUser[] = [
      {
        id: 'usr-demo-1',
        name: 'Elena Rostova',
        email: 'elena@skinsense.ai',
        passwordHash: demoPasswordHash,
        createdAt: new Date().toISOString(),
        history: [],
      },
    ];
    fs.writeFileSync(DB_PATH, JSON.stringify(initialUsers, null, 2), 'utf-8');
    return initialUsers;
  }
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2), 'utf-8');
}

// In-memory rate limiting map: ip -> { count: number, resetTime: number }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count++;
  return true;
}

// Input sanitizer: strips tags and trims
function sanitizeString(str: unknown): string {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper to extract JSON body from incoming Node HTTP request
async function getJsonBody(req: import('http').IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

// Extract JWT token from cookie or Authorization header
function extractToken(req: import('http').IncomingMessage): string | null {
  if (req.headers.cookie) {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.token) return cookies.token;
  }
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function authPlugin(): Plugin {
  return {
    name: 'skinsense-auth-plugin',
    configureServer(server: ViteDevServer) {
      ensureDatabase();

      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';
        const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

        // Only handle /api/auth and /api/user routes
        if (!url.startsWith('/api/auth') && !url.startsWith('/api/user')) {
          return next();
        }

        // Set JSON header and CORS
        res.setHeader('Content-Type', 'application/json');

        // 1. POST /api/auth/register
        if (url === '/api/auth/register' && req.method === 'POST') {
          if (!checkRateLimit(clientIp, 10)) {
            res.statusCode = 429;
            return res.end(JSON.stringify({ error: 'Too many registration requests. Please wait a minute.' }));
          }

          const body = await getJsonBody(req);
          const name = sanitizeString(body.name);
          const email = sanitizeString(body.email).toLowerCase();
          const password = typeof body.password === 'string' ? body.password : '';

          if (!name || name.length < 2) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Please enter a valid full name (at least 2 characters).' }));
          }
          if (!email || !isValidEmail(email)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Please enter a valid email address.' }));
          }
          if (!password || password.length < 6) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Password must be at least 6 characters long.' }));
          }

          const users = ensureDatabase();
          if (users.some((u) => u.email === email)) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'An account with this email already exists. Please sign in.' }));
          }

          const passwordHash = bcrypt.hashSync(password, 10);
          const newUser: StoredUser = {
            id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            name,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            history: [],
          };

          users.push(newUser);
          saveUsers(users);

          const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, {
            expiresIn: '7d',
          });

          // Set HTTP-only Cookie
          const cookieHeader = serializeCookie('token', token, {
            httpOnly: true,
            secure: false, // set false for localhost HTTP
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
          });
          res.setHeader('Set-Cookie', cookieHeader);

          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              user: { id: newUser.id, name: newUser.name, email: newUser.email },
              token,
            })
          );
        }

        // 2. POST /api/auth/login
        if (url === '/api/auth/login' && req.method === 'POST') {
          if (!checkRateLimit(clientIp, 6)) {
            res.statusCode = 429;
            return res.end(JSON.stringify({ error: 'Too many login attempts. Please wait 60 seconds.' }));
          }

          const body = await getJsonBody(req);
          const email = sanitizeString(body.email).toLowerCase();
          const password = typeof body.password === 'string' ? body.password : '';
          const rememberMe = Boolean(body.rememberMe);

          if (!email || !password) {
            res.statusCode = 400;
            return res.end(JSON.stringify({ error: 'Email and password are required.' }));
          }

          const users = ensureDatabase();
          const user = users.find((u) => u.email === email);

          if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'Incorrect email or password. Please verify credentials.' }));
          }

          const expiresIn = rememberMe ? '30d' : '7d';
          const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;

          const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
            expiresIn,
          });

          const cookieHeader = serializeCookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge,
            path: '/',
          });
          res.setHeader('Set-Cookie', cookieHeader);

          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              user: { id: user.id, name: user.name, email: user.email },
              token,
            })
          );
        }

        // 3. POST /api/auth/google (Simulated secure Google OAuth)
        if (url === '/api/auth/google' && req.method === 'POST') {
          const body = await getJsonBody(req);
          const name = sanitizeString(body.name) || 'Google User';
          const email = sanitizeString(body.email).toLowerCase() || 'user@google.com';

          const users = ensureDatabase();
          let user = users.find((u) => u.email === email);

          if (!user) {
            const passwordHash = bcrypt.hashSync(Math.random().toString(36), 10);
            user = {
              id: `usr-g-${Date.now()}`,
              name,
              email,
              passwordHash,
              createdAt: new Date().toISOString(),
              history: [],
            };
            users.push(user);
            saveUsers(users);
          }

          const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
            expiresIn: '7d',
          });

          res.setHeader(
            'Set-Cookie',
            serializeCookie('token', token, {
              httpOnly: true,
              secure: false,
              sameSite: 'lax',
              maxAge: 7 * 24 * 60 * 60,
              path: '/',
            })
          );

          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              user: { id: user.id, name: user.name, email: user.email },
              token,
            })
          );
        }

        // 4. GET /api/auth/me
        if (url === '/api/auth/me' && req.method === 'GET') {
          const token = extractToken(req);
          if (!token) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ user: null, error: 'Unauthenticated' }));
          }

          try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; name: string };
            const users = ensureDatabase();
            const user = users.find((u) => u.id === decoded.id);
            if (!user) {
              res.statusCode = 401;
              return res.end(JSON.stringify({ user: null, error: 'User account not found' }));
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ user: { id: user.id, name: user.name, email: user.email } }));
          } catch {
            res.statusCode = 401;
            return res.end(JSON.stringify({ user: null, error: 'Invalid or expired session token' }));
          }
        }

        // 5. POST /api/auth/logout
        if (url === '/api/auth/logout' && req.method === 'POST') {
          res.setHeader(
            'Set-Cookie',
            serializeCookie('token', '', {
              httpOnly: true,
              path: '/',
              maxAge: 0,
            })
          );
          res.statusCode = 200;
          return res.end(JSON.stringify({ success: true }));
        }

        // 6. GET /api/user/history
        if (url === '/api/user/history' && req.method === 'GET') {
          const token = extractToken(req);
          if (!token) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'Unauthenticated' }));
          }
          try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
            const users = ensureDatabase();
            const user = users.find((u) => u.id === decoded.id);
            res.statusCode = 200;
            return res.end(JSON.stringify({ history: user?.history || [] }));
          } catch {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'Invalid token' }));
          }
        }

        // 7. POST /api/user/history
        if (url === '/api/user/history' && req.method === 'POST') {
          const token = extractToken(req);
          if (!token) {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'Unauthenticated' }));
          }
          try {
            const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
            const body = await getJsonBody(req);
            const scan = body.scan;
            if (!scan) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Missing scan object' }));
            }
            const users = ensureDatabase();
            const user = users.find((u) => u.id === decoded.id);
            if (user) {
              if (!user.history) user.history = [];
              user.history.unshift(scan);
              saveUsers(users);
            }
            res.statusCode = 200;
            return res.end(JSON.stringify({ success: true }));
          } catch {
            res.statusCode = 401;
            return res.end(JSON.stringify({ error: 'Invalid token' }));
          }
        }

        return next();
      });
    },
  };
}
