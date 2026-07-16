import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export async function fetchReportHistory() {
  const { data } = await api.get('/reports');
  return data;
}

export async function fetchReportDashboard(id) {
  const { data } = await api.get(`/reports/${id}`);
  return data;
}

export async function createReport({ title, scopeType, authCode, filesByField }) {
  const form = new FormData();
  form.append('title', title);
  form.append('scopeType', scopeType);
  form.append('authCode', authCode);
  for (const [field, file] of Object.entries(filesByField)) {
    form.append(field, file);
  }
  const { data } = await api.post('/reports', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export function extractErrorMessage(err) {
  return err?.response?.data?.error || err?.message || 'Terjadi kesalahan tak terduga';
}
