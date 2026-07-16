import ExcelJS from 'exceljs';

export const HEADER_MAP = {
  'Proposal No': 'proposalNo',
  NIM: 'nim',
  'Nama Mahasiswa': 'namaMahasiswa',
  Major: 'major',
  Faculty: 'faculty',
  'Competition Name': 'competitionName',
  'Competition Organizer': 'competitionOrganizer',
  'Start Date': 'startDate',
  'End Date': 'endDate',
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
  'Competition Link': 'competitionLink',
};

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

function normalizeValue(key, raw) {
  if (raw === null || raw === undefined) return '';
  if (DATE_KEYS.has(key)) {
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
      return raw.toISOString().slice(0, 10);
    }
    const str = String(raw).trim();
    return str;
  }
  if (NUMBER_KEYS.has(key)) {
    const num = typeof raw === 'number' ? raw : parseFloat(String(raw).replace(',', '.'));
    return Number.isFinite(num) ? num : 0;
  }
  if (raw instanceof Date) return raw.toISOString().slice(0, 10);
  return String(raw).trim();
}

/**
 * Parses an uploaded achievement workbook into an array of plain row objects.
 * Only the first worksheet is read; rows with no Proposal No and no NIM are
 * treated as blank padding (as seen in the template) and skipped.
 */
export async function parseAchievementWorkbook(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  if (!sheet) return { rows: [], unknownColumns: [] };

  const headerRow = sheet.getRow(1);
  const colIndexToKey = {};
  const unknownColumns = [];
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    const headerText = String(cellToPlain(cell) || '').trim();
    const key = HEADER_MAP[headerText];
    if (key) {
      colIndexToKey[colNumber] = key;
    } else if (headerText) {
      unknownColumns.push(headerText);
    }
  });

  const rows = [];
  const rowCount = sheet.rowCount;
  for (let r = 2; r <= rowCount; r++) {
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
    if (!hasProposal && !hasNim) continue; // blank template row
    rows.push(obj);
  }

  return { rows, unknownColumns };
}
