import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import {
  DATA_DIR,
  readReports,
  appendReport,
} from '../utils/dataStore.js';
import { parseAchievementWorkbook } from '../utils/xlsxParser.js';
import { uniqueReportId } from '../utils/id.js';
import { SCOPE_DEFS, OFFSET_LABEL, OFFSET_FIELD, isValidScopeType } from '../utils/scopes.js';
import { baseAcademicYear, labelForOffset } from '../utils/academicYear.js';

const AUTH_CODE = process.env.REPORT_AUTH_CODE || 'SAUCKEREN';
const MAX_FILE_BYTES = 20 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES },
  fileFilter: (req, file, cb) => {
    const okExt = file.originalname.toLowerCase().endsWith('.xlsx');
    const okMime = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream',
      'application/zip',
    ].includes(file.mimetype);
    if (okExt && okMime) return cb(null, true);
    cb(new Error(`File "${file.originalname}" harus berformat .xlsx`));
  },
});

const uploadFields = upload.fields(OFFSET_FIELD.map((name) => ({ name, maxCount: 1 })));

const router = Router();

router.get('/reports', async (req, res, next) => {
  try {
    const reports = await readReports();
    const summaries = reports
      .map(({ id, title, scopeType, createdAt, academicYearBase, files }) => ({
        id,
        title,
        scopeType,
        createdAt,
        academicYearBase,
        files: files.map(({ label, academicYearLabel: ay, filename, url, rowCount }) => ({
          label,
          academicYearLabel: ay,
          filename,
          url,
          rowCount,
        })),
      }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(summaries);
  } catch (err) {
    next(err);
  }
});

router.get('/reports/:id', async (req, res, next) => {
  try {
    const reports = await readReports();
    const report = reports.find((r) => r.id === req.params.id);
    if (!report) return res.status(404).json({ error: 'Report tidak ditemukan' });

    const rows = [];
    for (const file of report.files) {
      const filePath = path.join(DATA_DIR, file.filename);
      try {
        const { rows: fileRows } = await parseAchievementWorkbook(filePath);
        for (const row of fileRows) {
          rows.push({ ...row, _year: file.label, _yearRange: file.academicYearLabel });
        }
      } catch (err) {
        return res.status(500).json({
          error: `Gagal membaca file ${file.filename}: ${err.message}`,
        });
      }
    }

    res.json({ report, rows });
  } catch (err) {
    next(err);
  }
});

router.post('/reports', (req, res, next) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload gagal' });
    }
    try {
      const { title, scopeType, authCode } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Judul report wajib diisi' });
      }
      if (!isValidScopeType(scopeType)) {
        return res.status(400).json({ error: 'Jenis report tidak valid' });
      }
      if (authCode !== AUTH_CODE) {
        return res.status(403).json({ error: 'Kode autentikasi salah' });
      }

      const { offsets } = SCOPE_DEFS[scopeType];
      const filesByOffset = offsets.map((offset) => {
        const field = OFFSET_FIELD[offset];
        const uploaded = req.files?.[field]?.[0];
        return { offset, uploaded };
      });
      const missing = filesByOffset.filter((f) => !f.uploaded);
      if (missing.length) {
        return res.status(400).json({
          error: `File untuk ${missing.map((m) => OFFSET_LABEL[m.offset]).join(', ')} belum diupload`,
        });
      }

      const reports = await readReports();
      const id = await uniqueReportId(reports.map((r) => r.id));
      const baseYear = baseAcademicYear(new Date());

      const files = [];
      for (const { offset, uploaded } of filesByOffset) {
        const label = OFFSET_LABEL[offset];
        const filename = `${id}_${label}.xlsx`;
        const destPath = path.join(DATA_DIR, filename);

        // sanity-check the workbook is actually parseable before persisting it
        const tmpPath = path.join(DATA_DIR, `.tmp_${id}_${label}.xlsx`);
        await fs.writeFile(tmpPath, uploaded.buffer);
        let rowCount = 0;
        try {
          const { rows } = await parseAchievementWorkbook(tmpPath);
          rowCount = rows.length;
        } catch (parseErr) {
          await fs.unlink(tmpPath).catch(() => {});
          return res.status(400).json({
            error: `File ${label} (${uploaded.originalname}) bukan file Excel prestasi yang valid: ${parseErr.message}`,
          });
        }
        await fs.rename(tmpPath, destPath);

        files.push({
          label,
          academicYearLabel: labelForOffset(baseYear, offset),
          filename,
          url: `data/${filename}`,
          originalName: uploaded.originalname,
          rowCount,
        });
      }

      const report = {
        id,
        title: title.trim(),
        scopeType,
        createdAt: new Date().toISOString(),
        academicYearBase: baseYear,
        files,
      };

      await appendReport(report);
      res.status(201).json({ report });
    } catch (err) {
      next(err);
    }
  });
});

export default router;
