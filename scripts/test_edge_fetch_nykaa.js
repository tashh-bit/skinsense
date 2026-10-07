import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const url = 'https://www.nykaa.com/minimalist-b12-oat-extract-6-5-gentle-cleanser/p/13247854';
  const proc = spawn(edgePath, [
    '--headless=new',
    '--disable-gpu',
    '--remote-debugging-port=9231',
    url,
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await sleep(400);
    try {
      const res = await fetch('http://127.0.0.1:9231/json/list');
      const list = await res.json();
      const page = list.find((p) => p.type === 'page');
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
  await sleep(4000);

  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const og = document.querySelector('meta[property="og:image"]');
        if (og && og.content) return og.content;
        const img = document.querySelector('img[src*="catalog/product"]');
        if (img) return img.src;
        return document.title;
      })()
    `,
    returnByValue: true,
  });

  console.log('Result from Nykaa via Edge:', evalResult.result.value);

  ws.close();
  proc.kill();
}

run().catch(console.error);
