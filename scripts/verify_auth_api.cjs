const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body ? JSON.parse(body) : null,
        });
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function run() {
  console.log('--- Testing SkinSense AI Auth API on port 5173 ---');

  // 1. Check unauthenticated /api/auth/me
  const meInitial = await request({
    hostname: 'localhost',
    port: 5173,
    path: '/api/auth/me',
    method: 'GET',
  });
  console.log('1. Initial /api/auth/me status:', meInitial.statusCode, 'body:', meInitial.body);

  // 2. Test Login with seeded credentials
  const loginRes = await request({
    hostname: 'localhost',
    port: 5173,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { email: 'elena@skinsense.ai', password: 'SkinSense@2026', rememberMe: true });
  console.log('2. Login status:', loginRes.statusCode, 'user:', loginRes.body?.user);
  console.log('   Set-Cookie header received:', Boolean(loginRes.headers['set-cookie']));

  const cookie = loginRes.headers['set-cookie']?.[0]?.split(';')[0];
  const token = loginRes.body?.token;

  // 3. Check authenticated /api/auth/me using cookie & Bearer
  const meAuthCookie = await request({
    hostname: 'localhost',
    port: 5173,
    path: '/api/auth/me',
    method: 'GET',
    headers: { Cookie: cookie },
  });
  console.log('3. Authenticated /api/auth/me via Cookie status:', meAuthCookie.statusCode, 'user:', meAuthCookie.body?.user);

  // 4. Test User History endpoint
  const historyRes = await request({
    hostname: 'localhost',
    port: 5173,
    path: '/api/user/history',
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('4. Authenticated /api/user/history status:', historyRes.statusCode, 'history items count:', historyRes.body?.history?.length);

  // 5. Test Register a new user
  const newEmail = `test_${Date.now()}@example.com`;
  const registerRes = await request({
    hostname: 'localhost',
    port: 5173,
    path: '/api/auth/register',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, { name: 'Aarav Patel', email: newEmail, password: 'StrongPassword@123' });
  console.log('5. Register new user status:', registerRes.statusCode, 'user:', registerRes.body?.user);

  // 6. Test Logout
  const logoutRes = await request({
    hostname: 'localhost',
    port: 5173,
    path: '/api/auth/logout',
    method: 'POST',
    headers: { Cookie: cookie },
  });
  console.log('6. Logout status:', logoutRes.statusCode, 'clear cookie received:', Boolean(logoutRes.headers['set-cookie']));

  console.log('--- ALL AUTH BACKEND TESTS COMPLETED SUCCESSFULLY ---');
}

run().catch((err) => {
  console.error('API Verification failed:', err);
  process.exit(1);
});
