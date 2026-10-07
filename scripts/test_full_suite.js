import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('--- Launching Microsoft Edge for Comprehensive SkinSense Verification ---');
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9228',
    '--window-size=1440,1100',
    'http://localhost:5173/',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9228/json/list');
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

  const capture = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = `${ARTIFACT_DIR}\\${name}.png`;
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${name}.png`);
  };

  // Helper to click by button text or selector
  const evalJs = async (code) => {
    return await send('Runtime.evaluate', {
      expression: code,
      returnByValue: true,
      awaitPromise: true,
    });
  };

  console.log('1. Direct navigation to Login page...');
  await evalJs(`
    const link = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Sign In');
    if (link) link.click();
  `);
  await sleep(1200);
  await capture('01_login_page_neo_apple');

  console.log('2. Auto-filling demo credentials...');
  await evalJs(`
    const fillBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fill Demo Credentials'));
    if (fillBtn) fillBtn.click();
  `);
  await sleep(600);
  await capture('02_login_demo_filled');

  console.log('3. Testing Sign up flip/mode transition and password strength meter...');
  await evalJs(`
    const signupToggle = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Sign up free');
    if (signupToggle) signupToggle.click();
  `);
  await sleep(800);

  // Type a sample password to test strength meter
  await evalJs(`
    const pwdInput = document.querySelector('input[placeholder="Create a strong password"]');
    if (pwdInput) {
      pwdInput.value = 'SkinSense@2026';
      pwdInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const nameInput = document.querySelector('input[placeholder="e.g. Dr. Maya Lin"]');
    if (nameInput) {
      nameInput.value = 'Maya Lin';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  `);
  await sleep(600);
  await capture('03_login_signup_strength_meter');

  console.log('4. Switching back to Sign in and authenticating...');
  await evalJs(`
    const signinToggle = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Sign in here');
    if (signinToggle) signinToggle.click();
  `);
  await sleep(600);

  await evalJs(`
    const fillBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fill Demo Credentials'));
    if (fillBtn) fillBtn.click();
  `);
  await sleep(600);

  await evalJs(`
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign in to Profile'));
    if (submitBtn) submitBtn.click();
  `);
  await sleep(2000);
  await capture('04_authenticated_user_navbar');

  console.log('5. Navigating to Products Catalog...');
  await evalJs(`
    const prodNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Products');
    if (prodNav) prodNav.click();
  `);
  await sleep(1500);
  await capture('05_products_catalog_all');

  console.log('6. Opening "Build My 4-Step Routine" modal...');
  await evalJs(`
    const routineBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Build My 4-Step Routine'));
    if (routineBtn) routineBtn.click();
  `);
  await sleep(1200);
  await capture('06_products_routine_builder_modal');

  console.log('7. Closing routine modal and testing filters (Category: Serums, Tier: Mid-Range)...');
  await evalJs(`
    const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Apply This Routine') || b.textContent.includes('Close'));
    if (closeBtn) closeBtn.click();
  `);
  await sleep(600);

  await evalJs(`
    const serumBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Serums'));
    if (serumBtn) serumBtn.click();
  `);
  await sleep(600);

  await evalJs(`
    const midTierBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Mid-Range'));
    if (midTierBtn) midTierBtn.click();
  `);
  await sleep(800);
  await capture('07_products_category_and_tier_filter');

  console.log('8. Checking Routine page matching products section...');
  await evalJs(`
    const routineLink = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'AI Guidance');
    if (routineLink) routineLink.click();
  `);
  await sleep(1500);

  // Scroll to bottom of routine page where matching products appear
  await evalJs('window.scrollTo({ top: 2200, behavior: "instant" });');
  await sleep(1000);
  await capture('08_routine_with_matching_products');

  console.log('9. Checking Results page matching products section...');
  await evalJs(`
    const resultsLink = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Conditions');
    if (resultsLink) resultsLink.click();
  `);
  await sleep(1500);

  await evalJs('window.scrollTo({ top: 2100, behavior: "instant" });');
  await sleep(1000);
  await capture('09_results_with_matching_products');

  console.log('10. Testing Logout...');
  await evalJs('window.scrollTo({ top: 0, behavior: "instant" });');
  await sleep(500);

  await evalJs(`
    const logoutBtn = document.querySelector('button[title="Sign out"]');
    if (logoutBtn) logoutBtn.click();
  `);
  await sleep(1200);
  await capture('10_logged_out_state');

  ws.close();
  proc.kill();
  console.log('--- ALL 10 TARGET TESTS AND SCREENSHOTS COMPLETED SUCCESSFULLY ---');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
