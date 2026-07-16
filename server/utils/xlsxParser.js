import ExcelJS from 'exceljs';

export const HEADER_MAP = {
  'Proposal No': 'proposalNo',
  NIM: 'nim',
  'Nama Mahasiswa': 'namaMahasiswa',
  Major: 'major',
  Faculty: 'faculty',
  'Competition Name': 'competitionName',
  'Competition Organizer': 'competitionOrganizer',
  'Competition Link': 'competitionLink',
  'Start Date': 'startDate',
  'End Date': 'endDate',
  Periode: 'periode',
  Scope: 'scope',
  Participant: 'participant',
  Represent: 'represent',
  Category: 'category',
  Bentuk: 'bentuk',
  Cabang: 'cabang',
  'Kategori Simkatmawa': 'kategoriSimkatmawa',
  'Supervisor 1': 'supervisor1',
  'Supervisor 2': 'supervisor2',
  Status: 'status',
  'Credit Point': 'creditPoint',
  Certificate: 'certificateUrl',
  'Assignment Letter': 'assignmentLetterUrl',
  Documentation: 'documentationUrl',
};

// Minimum matched columns for a row to be accepted as the header row —
// real-world exports prepend a merged title row before the actual headers.
const MIN_HEADER_MATCHES = 4;
const MAX_HEADER_SCAN_ROWS = 8;

const DATE_KEYS = new Set(['startDate', 'endDate']);
const NUMBER_KEYS = new Set(['creditPoint']);

function cellToPlain(cell) {
  const v = cell.value;
  if (v === null || v === undefined) return '';
  if (v instanceof Date) return v;
  if (typeof v === 'object') {
    if ('text' in v) return v.text;
    if ('richText' in v) return v.richText.map((r) => r.text).join('');
    if ('result' in v) return v.result;
    if ('hyperlink' in v) return v.text ?? v.hyperlink;
  }
  return v;
}

function parseDateValue(raw) {
  if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
    return raw.toISOString().slice(0, 10);
  }
  const str = String(raw ?? '').trim();
  if (!str) return '';
  // Indonesian export format: DD-MM-YYYY (also accepts DD/MM/YYYY)
  const dmy = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  return str;
}

function normalizeValue(key, raw) {
  if (raw === null || raw === undefined) return '';
  if (DATE_KEYS.has(key)) return parseDateValue(raw);
  if (NUMBER_KEYS.has(key)) {
    const num = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(',', '.'));
    return Number.isFinite(num) ? num : 0;
  }
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  return String(raw).trim();
}

/** Finds the header row within the first few rows — some exports prepend a
 *  merged title row (e.g. "Competition | ...") before the real headers. */
function findHeaderRow(sheet) {
  let best = { rowNumber: 1, matches: 0, colIndexToKey: {} };
  const scanLimit = Math.min(MAX_HEADER_SCAN_ROWS, sheet.rowCount);
  for (let r = 1; r <= scanLimit; r++) {
    const row = sheet.getRow(r);
    const colIndexToKey = {};
    let matches = 0;
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const headerText = String(cellToPlain(cell) || '').trim();
      const key = HEADER_MAP[headerText];
      if (key) {
        colIndexToKey[colNumber] = key;
        matches += 1;
      }
    });
    if (matches > best.matches) {
      best = { rowNumber: r, matches, colIndexToKey };
    }
    if (matches >= Object.keys(HEADER_MAP).length) break; // all columns found, stop early
  }
  return best;
}

/**
 * Parses an uploaded achievement workbook into an array of plain row objects.
 * Only the first worksheet is read; rows with no Proposal No and no NIM are
 * treated as blank padding and skipped.
 */
export async function parseAchievementWorkbook(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  if (!sheet) return { rows: [], unknownColumns: [] };

  const { rowNumber: headerRowNumber, colIndexToKey, matches } = findHeaderRow(sheet);
  if (matches < MIN_HEADER_MATCHES) {
    throw new Error(
      'Tidak dapat menemukan baris header yang sesuai (kolom Proposal No, NIM, dst.)'
    );
  }

  const rows = [];
  const rowCount = sheet.rowCount;
  for (let r = headerRowNumber + 1; r <= rowCount; r++) {
    const row = sheet.getRow(r);
    if (row.cellCount === 0) continue;
    const obj = {};
    let hasProposal = false;
    let hasNim = false;
    for (const [colNumber, key] of Object.entries(colIndexToKey)) {
      const cell = row.getCell(Number(colNumber));
      const value = normalizeValue(key, cellToPlain(cell));
      obj[key] = value;
      if (key === 'proposalNo' && value !== '') hasProposal = true;
      if (key === 'nim' && value !== '') hasNim = true;
    }
    if (!hasProposal && !hasNim) continue; // blank padding row
    rows.push(obj);
  }

  return { rows, unknownColumns: [] };
}
