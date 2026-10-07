import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const tempDir = path.join(os.tmpdir(), 'edge_cdp_' + Date.now());
  const outputPath = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2\\routine_cards_after.png';

  console.log('Spawning Edge with remote debugging...');
  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9222',
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
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const list = await res.json();
      const page = list.find((p) => p.type === 'page' && p.url.includes('5173'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch (e) {
      // Retrying
    }
  }

  if (!wsUrl) {
    console.error('Could not connect to Edge DevTools port 9222');
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

  await send('Page.enable');
  await send('Runtime.enable');

  // Wait for initial render
  await new Promise((r) => setTimeout(r, 1200));

  // Scroll to Personalized Care section
  console.log('Scrolling to Personalized Care section...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const headings = Array.from(document.querySelectorAll('h2'));
        const target = headings.find(h => h.textContent.includes('Personalized Care'));
        if (target) {
          target.scrollIntoView({ block: 'center', behavior: 'instant' });
          window.scrollBy(0, 150);
          return 'found and scrolled';
        }
        return 'not found';
      })()
    `,
  });

  // Wait for scroll & blur-in animations to settle cleanly
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Capturing screenshot...');
  const { data } = await send('Page.captureScreenshot', { format: 'png' });

  fs.writeFileSync(outputPath, Buffer.from(data, 'base64'));
  console.log('Screenshot saved successfully to:', outputPath);

  ws.close();
  edgeProc.kill();
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
