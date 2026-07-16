// Mirrors server/utils/scopes.js — the 4 "Tambah Report Baru" options.
export const SCOPE_DEFS = {
  TA: {
    label: 'Data TA',
    description: 'Bandingkan hanya tahun ajaran saat ini',
    offsets: [0],
  },
  'TA_TA-1': {
    label: 'Data TA hingga TA-1',
    description: 'Bandingkan 2 tahun ajaran terakhir',
    offsets: [0, 1],
  },
  'TA_TA-2': {
    label: 'Data TA hingga TA-2',
    description: 'Bandingkan 3 tahun ajaran terakhir',
    offsets: [0, 1, 2],
  },
  'TA_TA-3': {
    label: 'Data TA hingga TA-3',
    description: 'Bandingkan 4 tahun ajaran terakhir',
    offsets: [0, 1, 2, 3],
  },
};

export const OFFSET_LABEL = ['TA', 'TA-1', 'TA-2', 'TA-3'];
export const OFFSET_FIELD = ['file_TA', 'file_TA_1', 'file_TA_2', 'file_TA_3'];
