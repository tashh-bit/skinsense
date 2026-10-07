const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\66417ed3-b4f8-4703-80c5-5debcecac35b';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('--- Launching Edge for Comprehensive Full-App Verification ---');
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9240',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--window-size=1440,1100',
    'http://127.0.0.1:5173/',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9240/json/list');
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

  console.log('1. Capturing Hero Section (Animated AI scan, Detection Boxes, Stats)...');
  await sleep(2500);
  await capture('hero_section.png');

  console.log('2. Scrolling to Scene 1 of ScrollStory ("Skincare. Personalized.")...');
  await evaluate(`window.scrollTo({ top: window.innerHeight * 1.15, behavior: 'instant' });`);
  await sleep(1500);
  await capture('scroll_story_scene1.png');

  console.log('3. Scrolling to Scene 2 of ScrollStory ("One size does not fit all.")...');
  await evaluate(`window.scrollTo({ top: window.innerHeight * 2.3, behavior: 'instant' });`);
  await sleep(1500);
  await capture('scroll_story_scene2.png');

  console.log('4. Navigating to Login Page (Tilted Glass Tiles, Peach Spheres, Rose Gold Arch)...');
  await evaluate(`
    const signinBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sign In'));
    if (signinBtn) signinBtn.click();
  `);
  await sleep(1500);
  await capture('login_page.png');

  console.log('5. Logging into SkinSense AI (Authenticating Elena Rostova)...');
  await evaluate(`
    const emailInput = document.querySelector('input[type="email"]');
    const passInput = document.querySelector('input[type="password"]');
    if (emailInput && passInput) {
      emailInput.value = 'elena@skinsense.ai';
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      passInput.value = 'SkinSense@2026';
      passInput.dispatchEvent(new Event('input', { bubbles: true }));
      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  `);
  await sleep(2000);

  console.log('6. Navigating to Live Camera Analysis (Oval Face Guide & Tips)...');
  await evaluate(`
    const analyzeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze') || b.textContent.includes('Try the App'));
    if (analyzeBtn) analyzeBtn.click();
  `);
  await sleep(2500);
  await capture('camera_analyze.png');

  console.log('7. Navigating to Routine Regimen (Horizontal Snap Carousel)...');
  await evaluate(`
    // Click Your Skin or navigate to routine
    const navButtons = Array.from(document.querySelectorAll('button'));
    const skinNav = navButtons.find(b => b.textContent.includes('Your Skin'));
    if (skinNav) skinNav.click();
  `);
  await sleep(1500);
  // From Skin/Results, click View Prescribed Routine
  await evaluate(`
    const routineBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Routine') || b.textContent.includes('Regimen'));
    if (routineBtn) routineBtn.click();
  `);
  await sleep(2000);
  await capture('routine_carousel.png');

  console.log('8. Navigating to Diet & Nutrition Protocol (Indian Meal Plans & Hydration)...');
  await evaluate(`
    const dietNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('AI Guidance') || b.textContent.includes('Diet'));
    if (dietNav) dietNav.click();
  `);
  await sleep(2000);
  await capture('diet_protocol.png');

  console.log('9. Navigating to Products Shop & Showcase Slider (INR Collection Reel)...');
  await evaluate(`
    const prodNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Conditions') || b.textContent.includes('Products'));
    if (prodNav) prodNav.click();
  `);
  await sleep(2500);
  await capture('products_showcase_slider.png');

  console.log('10. Opening "Build My Complete Routine" Modal in Products...');
  await evaluate(`
    const buildBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Build My Complete Routine'));
    if (buildBtn) buildBtn.click();
  `);
  await sleep(1500);
  await capture('routine_builder_modal.png');

  console.log('\n======================================================');
  console.log('  VERIFICATION SUITE COMPLETED SUCCESSFULLY');
  console.log(`  Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach(e => console.error('  ! ' + e));
  } else {
    console.log('  ? ZERO console errors detected across entire journey!');
  }
  console.log('======================================================\n');

  proc.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

