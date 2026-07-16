// Indonesian academic year (Tahun Ajaran) runs roughly Aug -> Jul.
// A date in Jul..Dec belongs to the TA that starts that calendar year;
// a date in Jan..Jun belongs to the TA that started the previous year.
export function baseAcademicYear(date = new Date()) {
  const month = date.getMonth(); // 0-indexed
  return month >= 6 ? date.getFullYear() : date.getFullYear() - 1;
}

export function academicYearLabel(baseYear) {
  return `${baseYear}/${baseYear + 1}`;
}

// offset: 0 = TA, 1 = TA-1, 2 = TA-2, 3 = TA-3
export function labelForOffset(baseYear, offset) {
  return academicYearLabel(baseYear - offset);
}
