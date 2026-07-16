// Mirrors server/utils/academicYear.js for display purposes only —
// the server is the source of truth for what gets persisted.
export function baseAcademicYear(date = new Date()) {
  const month = date.getMonth();
  return month >= 6 ? date.getFullYear() : date.getFullYear() - 1;
}

export function academicYearLabel(baseYear) {
  return `${baseYear}/${baseYear + 1}`;
}

export function labelForOffset(baseYear, offset) {
  return academicYearLabel(baseYear - offset);
}
