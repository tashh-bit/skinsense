import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const tempDir = path.join(os.tmpdir(), 'edge_verify_' + Date.now());
  const artifactDir = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2';

  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9224',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    `--user-data-dir=${tempDir}`,
    '--window-size=1440,1400',
    'http://localhost:5173/',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9224/json/list');
      const list = await res.json();
      const page = list.find((p) => p.type === 'page' && p.url.includes('5173'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    console.error('CDP connection failed');
    edgeProc.kill();
    process.exit(1);
  }

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

  const consoleLogs = [];
  ws.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const type = data.params.type;
        const text = data.params.args.map((a) => a.value || JSON.stringify(a)).join(' ');
        consoleLogs.push({ type, text });
        console.log(`[BROWSER ${type}]:`, text);
      }
    } catch {}
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Console.enable');

  const evaluate = async (expression) => {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res?.result?.value;
  };

  const captureScreenshot = async (filename) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const fullPath = path.join(artifactDir, filename);
    fs.writeFileSync(fullPath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  };

  // Wait for initial load
  await new Promise((r) => setTimeout(r, 2000));

  // 1. Go to Analyze page and open camera
  console.log('Opening Camera on Analyze page...');
  await evaluate(`
    const navAnalyze = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Analyze Skin') || b.textContent.includes('Try the App'));
    if (navAnalyze) navAnalyze.click();
  `);
  await new Promise((r) => setTimeout(r, 1200));

  await evaluate(`
    const openCam = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Open Camera'));
    if (openCam) openCam.click();
  `);
  await new Promise((r) => setTimeout(r, 2500));

  // Capture clean camera view
  await captureScreenshot('camera_full_view.png');

  // Check video element state
  const videoState = await evaluate(`
    const video = document.querySelector('video');
    ({
      hasVideo: !!video,
      srcObject: !!video?.srcObject,
      videoWidth: video?.videoWidth,
      videoHeight: video?.videoHeight,
      paused: video?.paused,
      currentTime: video?.currentTime
    })
  `);
  console.log('Video Element State in Browser:', videoState);

  // Click capture photo button
  console.log('Triggering Capture...');
  const captureResult = await evaluate(`
    const capBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Capture for AI Analysis'));
    if (capBtn) {
      capBtn.scrollIntoView({ behavior: 'instant', block: 'center' });
      capBtn.click();
      true;
    } else {
      false;
    }
  `);
  console.log('Capture button clicked:', captureResult);
  await new Promise((r) => setTimeout(r, 1500));
  await captureScreenshot('capture_preview_confirmed.png');

  // 2. Test Diet & Nutrition Page directly via Navbar
  console.log('Navigating to Diet & Nutrition...');
  await evaluate(`
    const dietNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Diet & Nutrition');
    if (dietNav) {
      dietNav.click();
    }
  `);
  await new Promise((r) => setTimeout(r, 1500));
  await captureScreenshot('diet_page_full.png');

  // Interact with hydration tracker (click glass 8) and switch to Meal Plan
  console.log('Interacting with Diet page components...');
  await evaluate(`
    // Click glass 8
    const glasses = Array.from(document.querySelectorAll('button')).filter(b => b.textContent.includes('ml'));
    if (glasses.length >= 8) glasses[7].click();

    // Click Non-Veg preference
    const nonVegBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Non-Vegetarian'));
    if (nonVegBtn) nonVegBtn.click();

    // Switch to Sample 1-Day Meal Plan tab
    const mealPlanTab = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Sample 1-Day Meal Plan'));
    if (mealPlanTab) mealPlanTab.click();
  `);
  await new Promise((r) => setTimeout(r, 1200));
  await captureScreenshot('diet_meal_plan_nonveg.png');

  // Test switching condition to 'Acne & Breakouts'
  console.log('Switching condition pill to Acne...');
  await evaluate(`
    const acnePill = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Acne & Breakouts'));
    if (acnePill) acnePill.click();
  `);
  await new Promise((r) => setTimeout(r, 1200));
  await captureScreenshot('diet_acne_condition.png');

  // 3. Test Results Page with Diet Protocol Banner
  console.log('Navigating to Conditions / Results page...');
  await evaluate(`
    const condNav = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Conditions');
    if (condNav) condNav.click();
  `);
  await new Promise((r) => setTimeout(r, 1500));

  // Scroll down to the Diet banner and Next Steps
  await evaluate(`
    window.scrollTo({ top: 900, behavior: 'instant' });
  `);
  await new Promise((r) => setTimeout(r, 800));
  await captureScreenshot('results_diet_integration.png');

  console.log('All verification stages complete!');
  const errors = consoleLogs.filter((l) => l.type === 'error');
  console.log('Browser Error Count:', errors.length);
  if (errors.length > 0) {
    console.error('Browser Errors:', errors);
  }

  ws.close();
  edgeProc.kill();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
