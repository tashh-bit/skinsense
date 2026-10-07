import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const tempDir = path.join(os.tmpdir(), 'edge_camera_diet_' + Date.now());
  const artifactDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2';

  console.log('Spawning Edge with fake media stream flags...');
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    `--user-data-dir=${tempDir}`,
    '--window-size=1440,1100',
    'http://localhost:5173/',
  ]);

  edgeProc.on('error', (err) => console.error('Edge spawn error:', err));

  // Wait for Edge CDP port to open
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
      const list = await res.json();
      const page = list.find((p) => p.type === 'page' && p.url.includes('5173'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {
      // Retrying
    }
  }

  if (!wsUrl) {
    console.error('Could not connect to Edge DevTools port 9223');
    edgeProc.kill();
    process.exit(1);
  }

  console.log('Connected to CDP at:', wsUrl);
  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const send = (method, params = {}) => {
    return new Promise((resolve) => {
      const id = msgId++;
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          resolve(data.result);
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
        const text = data.params.args.map((a) => a.value || JSON.stringify(a)).join(' ');
        if (type === 'error') {
          consoleErrors.push(text);
          console.error('[BROWSER ERROR]:', text);
        } else {
          console.log(`[BROWSER ${type.toUpperCase()}]:`, text);
        }
      } else if (data.method === 'Runtime.exceptionThrown') {
        const ex = data.params.exceptionDetails?.text || 'Exception';
        consoleErrors.push(ex);
        console.error('[BROWSER EXCEPTION]:', ex);
      }
    } catch {
      // ignore
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');

  // Helper to evaluate JS in the browser
  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res?.result?.value;
  };

  // Helper to capture a screenshot
  const captureScreenshot = async (filename) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(artifactDir, filename);
    fs.writeFileSync(fullPath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot to: ${fullPath}`);
    return fullPath;
  };

  // Wait for initial load
  console.log('Waiting for homepage to hydrate...');
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Navigate to Analyze page
  console.log('Navigating to Analyze page...');
  await evaluate(`
    const navBtns = Array.from(document.querySelectorAll('button'));
    const tryBtn = navBtns.find(b => b.textContent.includes('Analyze Skin') || b.textContent.includes('Try the App'));
    if (tryBtn) tryBtn.click();
  `);
  await new Promise((r) => setTimeout(r, 1500));

  // 2. Click "Open Camera"
  console.log('Clicking Open Camera...');
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const camBtn = btns.find(b => b.textContent.includes('Open Camera'));
    if (camBtn) camBtn.click();
  `);
  await new Promise((r) => setTimeout(r, 2500));

  // Capture Camera Viewfinder Screenshot
  console.log('Capturing Camera Viewfinder...');
  await captureScreenshot('camera_viewfinder.png');

  // 3. Test Live Mode toggle
  console.log('Toggling Live Mode...');
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const liveBtn = btns.find(b => b.textContent.includes('Live Mode'));
    if (liveBtn) liveBtn.click();
  `);
  await new Promise((r) => setTimeout(r, 2500));
  await captureScreenshot('camera_live_mode.png');

  // 4. Capture Frame for AI Analysis
  console.log('Clicking Capture for AI Analysis...');
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const capBtn = btns.find(b => b.textContent.includes('Capture for AI Analysis'));
    if (capBtn) capBtn.click();
  `);
  await new Promise((r) => setTimeout(r, 1500));
  await captureScreenshot('camera_frame_preview.png');

  // 5. Click "Begin AI Analysis" to test the full pipeline
  console.log('Starting AI Analysis...');
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const beginBtn = btns.find(b => b.textContent.includes('Begin AI Analysis'));
    if (beginBtn) beginBtn.click();
  `);
  // Wait for scanning stages
  await new Promise((r) => setTimeout(r, 6000));

  // 6. We should now be on the Results page!
  console.log('Capturing Results page with Diet banner...');
  await captureScreenshot('results_with_diet_banner.png');

  // 7. Click "View Diet & Nutrition Protocol"
  console.log('Navigating to Diet & Nutrition page...');
  await evaluate(`
    const btns = Array.from(document.querySelectorAll('button'));
    const dietBtn = btns.find(b => b.textContent.includes('View Diet') || b.textContent.includes('Diet & Nutrition'));
    if (dietBtn) dietBtn.click();
  `);
  await new Promise((r) => setTimeout(r, 1500));

  // 8. Capture Diet Overview
  console.log('Capturing Diet page overview...');
  await captureScreenshot('diet_nutrition_overview.png');

  // 9. Interact with Hydration Tracker (click glass 7) and switch to Meal Plan tab
  console.log('Interacting with Hydration Tracker and tabs...');
  await evaluate(`
    const glasses = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('ml'));
    if (glasses.length >= 7) glasses[6].click();

    const tabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Sample 1-Day Meal Plan'));
    if (tabs.length > 0) tabs[0].click();
  `);
  await new Promise((r) => setTimeout(r, 1200));
  await captureScreenshot('diet_nutrition_meal_plan.png');

  // Switch to Foods That Help tab
  await evaluate(`
    const tabs = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('Foods That Help'));
    if (tabs.length > 0) tabs[0].click();
  `);
  await new Promise((r) => setTimeout(r, 1200));
  await captureScreenshot('diet_nutrition_foods_to_eat.png');

  console.log('All automated end-to-end tests finished!');
  console.log('Total console errors captured:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Console errors:', consoleErrors);
  }

  ws.close();
  edgeProc.kill();
}

main().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
