import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'diagram.json');
const PORT = process.env.PORT || 80;

const ensureDataFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const initialPayload = {
      diagramData: {
        nodes: [],
        links: [],
        groups: [],
      },
      componentTypes: [],
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialPayload, null, 2), 'utf-8');
  }
};

const readDiagram = async () => {
  await ensureDataFile();
  const fileContents = await fs.readFile(DATA_FILE, 'utf-8');
  if (!fileContents.trim()) {
    return null;
  }
  try {
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to parse diagram data file', error);
    throw error;
  }
};

const writeDiagram = async (payload) => {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), 'utf-8');
};

const sendJson = (res, statusCode, body) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  if (body === undefined) {
    res.end();
  } else {
    res.end(JSON.stringify(body));
  }
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { message: 'Invalid request' });
    return;
  }

  const { pathname } = new URL(req.url, 'http://localhost');

  if (req.method === 'OPTIONS') {
    sendJson(res, 204);
    return;
  }

  if (pathname === '/api/diagram' && req.method === 'GET') {
    try {
      const data = await readDiagram();
      if (!data) {
        sendJson(res, 204);
        return;
      }
      sendJson(res, 200, data);
    } catch (error) {
      console.error('Failed to load diagram', error);
      sendJson(res, 500, { message: 'Failed to load diagram data' });
    }
    return;
  }

  if (pathname === '/api/diagram' && req.method === 'POST') {
    let rawBody = '';
    req.on('data', chunk => {
      rawBody += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(rawBody || '{}');
        if (!payload || typeof payload !== 'object') {
          sendJson(res, 400, { message: 'Invalid payload' });
          return;
        }
        if (!payload.diagramData || !payload.componentTypes) {
          sendJson(res, 400, { message: 'Payload must include diagramData and componentTypes' });
          return;
        }
        await writeDiagram(payload);
        sendJson(res, 200, { message: 'Diagram saved' });
      } catch (error) {
        console.error('Failed to save diagram', error);
        sendJson(res, 500, { message: 'Failed to save diagram data' });
      }
    });
    return;
  }

  sendJson(res, 404, { message: 'Not found' });
});

server.listen(PORT, () => {
  console.log(`Diagram backend listening on port ${PORT}`);
});
