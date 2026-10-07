import { spawn } from 'child_process';
import fs from 'fs';

const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9230',
    '--window-size=1440,1100',
    'http://localhost:5173/',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9230/json/list');
      const list = await res.json();
      const page = list.find((p) => p.type === 'page' && p.url.includes('5173'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    proc.kill();
    return;
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

  const evalJs = async (code) => {
    return await send('Runtime.evaluate', {
      expression: code,
      returnByValue: true,
      awaitPromise: true,
    });
  };

  // Sign in
  await evalJs(`
    const signin = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Sign In');
    if (signin) signin.click();
  `);
  await sleep(1000);

  await evalJs(`
    const fillBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fill Demo Credentials'));
    if (fillBtn) fillBtn.click();
  `);
  await sleep(500);

  await evalJs(`
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign in to Profile'));
    if (submitBtn) submitBtn.click();
  `);
  await sleep(1500);

  // Go to products
  await evalJs(`
    const prodNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Products');
    if (prodNav) prodNav.click();
  `);
  await sleep(1500);

  // Scroll to reveal product cards and prices
  await evalJs('window.scrollTo({ top: 620, behavior: "instant" });');
  await sleep(1000);

  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const filePath = `${ARTIFACT_DIR}\\05b_products_catalog_cards_and_disclaimer.png`;
  fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
  console.log(`Saved screenshot: 05b_products_catalog_cards_and_disclaimer.png`);

  ws.close();
  proc.kill();
}

run().catch(console.error);
