import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const DATA_DIR = path.join(__dirname, '..', '..', 'data');
export const DATA_JSON_PATH = path.join(DATA_DIR, 'data.json');

let writeQueue = Promise.resolve();

export async function readReports() {
  try {
    const raw = await fs.readFile(DATA_JSON_PATH, 'utf-8');
    const trimmed = raw.trim();
    if (!trimmed) return [];
    const parsed = JSON.parse(trimmed);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Serialize writes so concurrent submissions never clobber each other.
export function writeReports(reports) {
  writeQueue = writeQueue.then(() =>
    fs.writeFile(DATA_JSON_PATH, JSON.stringify(reports, null, 2), 'utf-8')
  );
  return writeQueue;
}

export async function appendReport(report) {
  const reports = await readReports();
  reports.push(report);
  await writeReports(reports);
  return reports;
}
