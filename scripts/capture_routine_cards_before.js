import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const tempDir = path.join(os.tmpdir(), 'edge_cdp_before_' + Date.now());
  const outputPath = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2\\routine_cards_before.png';

  const edgeProc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9223',
    `--user-data-dir=${tempDir}`,
    '--window-size=1440,1100',
    'http://localhost:5173/',
  ]);

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
    } catch (e) {}
  }

  if (!wsUrl) {
    edgeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve) => {
    ws.onopen = resolve;
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
  await new Promise((r) => setTimeout(r, 1200));

  // Revert visual styling to "Before" plain cream & solid card look
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Hide ambient drifting blobs
        const ambient = document.querySelector('[aria-hidden="true"]');
        if (ambient) ambient.style.display = 'none';

        // Revert root background to plain cream
        document.body.style.backgroundColor = '#FBF9F5';
        const main = document.querySelector('main')?.parentElement;
        if (main) main.style.backgroundColor = '#FBF9F5';

        // Revert section styling
        const headings = Array.from(document.querySelectorAll('h2'));
        const target = headings.find(h => h.textContent.includes('Personalized Care'));
        if (target) {
          target.scrollIntoView({ block: 'center', behavior: 'instant' });
          window.scrollBy(0, 150);
          const section = target.closest('section');
          if (section) section.style.backgroundColor = '#FBF9F5';
        }

        // Revert cards to flat solid white
        document.querySelectorAll('.glass').forEach(el => {
          el.style.background = '#FFFFFF';
          el.style.backdropFilter = 'none';
          el.style.webkitBackdropFilter = 'none';
          el.style.border = '1px solid rgba(25, 22, 20, 0.08)';
          el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
        });

        // Revert sub panels to flat grey-cream
        document.querySelectorAll('.glass-sub').forEach(el => {
          el.style.background = '#FAF8F4';
          el.style.backdropFilter = 'none';
          el.style.webkitBackdropFilter = 'none';
          el.style.border = '1px solid rgba(25, 22, 20, 0.06)';
          el.style.boxShadow = 'none';
        });

        // Revert chips to flat beige
        document.querySelectorAll('.glass-chip').forEach(el => {
          el.style.background = '#FAF5EA';
          el.style.backdropFilter = 'none';
          el.style.webkitBackdropFilter = 'none';
          el.style.border = '1px solid #E8DAC0';
          el.style.boxShadow = 'none';
        });
      })()
    `,
  });

  await new Promise((r) => setTimeout(r, 1500));

  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(outputPath, Buffer.from(data, 'base64'));
  console.log('Saved before state to:', outputPath);

  ws.close();
  edgeProc.kill();
  process.exit(0);
}

main().catch(console.error);
