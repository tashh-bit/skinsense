import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function main() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9226',
    '--window-size=1440,1600',
    'http://localhost:5173/',
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 400));
    try {
      const res = await fetch('http://127.0.0.1:9226/json/list');
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
  await new Promise((r) => setTimeout(r, 1500));

  await send('Runtime.evaluate', {
    expression: `
      const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent.includes('Diet'));
      if (b) b.click();
    `,
  });
  await new Promise((r) => setTimeout(r, 1500));

  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 1100, behavior: "instant" });',
  });
  await new Promise((r) => setTimeout(r, 800));

  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\DELL\\.gemini\\antigravity-ide\\brain\\78485c88-3a31-4d18-b571-12b56796b3f2\\diet_routine_synergy_and_disclaimer.png';
  fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
  console.log('Saved to:', outPath);

  ws.close();
  proc.kill();
}

main().catch(console.error);
