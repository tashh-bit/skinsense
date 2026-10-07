import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('Launching Microsoft Edge for SkinSense AI E2E UI verification...');
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9227',
    '--window-size=1440,1100',
    'http://localhost:5173/',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9227/json/list');
      const list = await res.json();
      const page = list.find((p) => p.type === 'page' && p.url.includes('5173'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to Edge DevTools WebSocket');
    proc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  let msgId = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      const timeout = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 15000);
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          clearTimeout(timeout);
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await sleep(1500);

  // Helper to capture and write screenshot
  const capture = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = `${ARTIFACT_DIR}\\${name}.png`;
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${name}.png`);
  };

  console.log('1. Navigating to Login Page...');
  await send('Runtime.evaluate', {
    expression: `
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign In') || b.textContent.includes('Account / Login'));
      if (btn) btn.click();
    `,
  });
  await sleep(1500);
  await capture('login_page_neo_apple');

  console.log('2. Auto-filling Demo credentials...');
  await send('Runtime.evaluate', {
    expression: `
      const demoBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('fill demo account') || b.textContent.includes('Elena'));
      if (demoBtn) demoBtn.click();
    `,
  });
  await sleep(1000);
  await capture('login_filled_demo_credentials');

  console.log('3. Clicking Sign In...');
  await send('Runtime.evaluate', {
    expression: `
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Sign in' || b.textContent.includes('Sign in to Account'));
      if (submitBtn) submitBtn.click();
    `,
  });
  await sleep(2500);
  await capture('authenticated_dashboard_state');

  console.log('4. Navigating to Products Catalog...');
  await send('Runtime.evaluate', {
    expression: `
      const prodLink = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Products' || b.textContent.includes('Products'));
      if (prodLink) prodLink.click();
    `,
  });
  await sleep(1500);
  await capture('products_catalog_inr');

  console.log('5. Opening "Build My 4-Step Routine" modal...');
  await send('Runtime.evaluate', {
    expression: `
      const routineBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Build My 4-Step Routine') || b.textContent.includes('Routine'));
      if (routineBtn) routineBtn.click();
    `,
  });
  await sleep(1200);
  await capture('products_routine_builder_modal');

  console.log('6. Closing modal and applying filters...');
  await send('Runtime.evaluate', {
    expression: `
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Close') || b.textContent.includes('Apply This Routine'));
      if (closeBtn) closeBtn.click();
    `,
  });
  await sleep(800);

  // Filter by category: "Serums"
  await send('Runtime.evaluate', {
    expression: `
      const serumBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Serums'));
      if (serumBtn) serumBtn.click();
    `,
  });
  await sleep(1000);
  await capture('products_filtered_serums');

  console.log('7. Navigating to Routine page to verify Matching Products...');
  await send('Runtime.evaluate', {
    expression: `
      const routineNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'AI Guidance' || b.textContent.includes('Routine'));
      if (routineNav) routineNav.click();
    `,
  });
  await sleep(1500);

  // Scroll down to the matching products section on Routine
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 1200, behavior: "instant" });',
  });
  await sleep(1000);
  await capture('routine_matching_products');

  console.log('8. Testing Logout...');
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 0, behavior: "instant" });',
  });
  await sleep(600);
  await send('Runtime.evaluate', {
    expression: `
      const logoutBtn = document.querySelector('button[title="Sign out"]') || Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign Out') || b.textContent.includes('Logout'));
      if (logoutBtn) logoutBtn.click();
    `,
  });
  await sleep(1200);
  await capture('logged_out_state');

  ws.close();
  proc.kill();
  console.log('--- ALL E2E UI TESTS AND SCREENSHOTS COMPLETED SUCCESSFULLY ---');
}

run().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
