const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\66417ed3-b4f8-4703-80c5-5debcecac35b';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('--- Launching Edge for Authenticated Section Capture ---');
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9250',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--window-size=1440,1100',
    'http://127.0.0.1:5173/',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9250/json/list');
      const list = await res.json();
      const page = list.find((p) => p.type === 'page' && p.url.includes('5173'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to Edge CDP');
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
      const timeout = setTimeout(() => reject(new Error(`Timeout on ${method}`)), 20000);
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

  const consoleErrors = [];
  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const type = data.params.type;
        const text = data.params.args.map((a) => a.value || a.description || '').join(' ');
        if (type === 'error') {
          consoleErrors.push(text);
          console.error('[BROWSER ERROR]', text);
        }
      }
    } catch {}
  });

  await send('Runtime.enable');
  await send('Page.enable');

  const capture = async (name) => {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const outPath = path.join(ARTIFACT_DIR, name);
    fs.writeFileSync(outPath, buffer);
    console.log(`[CAPTURED] ${name} (${buffer.length} bytes)`);
  };

  const evaluate = async (expression) => {
    return await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
  };

  console.log('1. Navigating to Login...');
  await sleep(2000);
  await evaluate(`
    const signinBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign In'));
    if (signinBtn) signinBtn.click();
  `);
  await sleep(1500);

  console.log('2. Clicking Fill Demo Credentials and Signing in...');
  await evaluate(`
    const fillBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Fill Demo'));
    if (fillBtn) fillBtn.click();
  `);
  await sleep(1000);

  await evaluate(`
    const submitBtn = document.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.click();
  `);
  await sleep(2500);

  console.log('3. Navigating to Live Camera Analysis...');
  await evaluate(`
    const analyzeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze') || b.textContent.includes('Try the App'));
    if (analyzeBtn) analyzeBtn.click();
  `);
  await sleep(3000);
  await evaluate(`const camBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Open Camera')); if (camBtn) camBtn.click();`);
  await sleep(2500);
  await capture('camera_analyze.png');

  console.log('4. Navigating to Routine Regimen (Horizontal Snap Carousel)...');
  await evaluate(`
    const yourSkin = Array.from(document.querySelectorAll('header nav button')).find(b => b.textContent.includes('Your Skin'));
    if (yourSkin) yourSkin.click();
  `);
  await sleep(1800);

  // Click View Prescribed Routine from Results
  await evaluate(`
    const routineBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('View Prescribed Routine') || b.textContent.includes('Regimen'));
    if (routineBtn) routineBtn.click();
  `);
  await sleep(2000);
  await capture('routine_carousel.png');

  console.log('5. Navigating to Diet & Nutrition Protocol...');
  await evaluate(`
    const dietNav = Array.from(document.querySelectorAll('header nav button')).find(b => b.textContent.includes('Diet & Nutrition'));
    if (dietNav) dietNav.click();
  `);
  await sleep(2000);
  await capture('diet_protocol.png');

  console.log('6. Navigating to Products Shop & Showcase Reel Slider...');
  await evaluate(`
    const prodNav = Array.from(document.querySelectorAll('header nav button')).find(b => b.textContent.includes('Products'));
    if (prodNav) prodNav.click();
  `);
  await sleep(2500);
  await capture('products_showcase_slider.png');

  console.log('7. Opening Build My Routine Modal...');
  await evaluate(`
    const buildBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Build My Complete Routine'));
    if (buildBtn) buildBtn.click();
  `);
  await sleep(1500);
  await capture('routine_builder_modal.png');

  console.log('\n======================================================');
  console.log('  AUTHENTICATED CAPTURE COMPLETED');
  console.log(`  Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.error('  ! ' + e));
  } else {
    console.log('  ? ZERO console errors recorded across all authenticated flows!');
  }
  console.log('======================================================\n');

  proc.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
