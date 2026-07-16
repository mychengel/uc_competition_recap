// Client-side aggregation over raw achievement rows.
// Core rule: rows sharing the same (year, Proposal No) are ONE achievement —
// whether it was a team or an individual entry, it is counted once.

export const YEAR_ORDER = ['TA-3', 'TA-2', 'TA-1', 'TA'];

const UNKNOWN = 'Tidak diketahui';

function clean(v) {
  if (v === null || v === undefined) return '';
  const s = String(v).trim();
  return s;
}

function orLabel(v) {
  const s = clean(v);
  return s === '' ? UNKNOWN : s;
}

export function sortByYearOrder(a, b) {
  return YEAR_ORDER.indexOf(a) - YEAR_ORDER.indexOf(b);
}

/** Group raw rows into one record per achievement (year + Proposal No). */
export function groupAchievements(rows) {
  const map = new Map();
  for (const row of rows) {
    const proposalNo = clean(row.proposalNo);
    const key = `${row._year}__${proposalNo || `__no-proposal-${row.nim}-${row.competitionName}`}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        proposalNo,
        year: row._year,
        yearRange: row._yearRange,
        rows: [],
        majors: new Set(),
        faculties: new Set(),
      });
    }
    const group = map.get(key);
    group.rows.push(row);
    group.majors.add(orLabel(row.major));
    group.faculties.add(orLabel(row.faculty));
  }

  return Array.from(map.values()).map((g) => {
    const first = g.rows[0];
    const creditPoint = Math.max(0, ...g.rows.map((r) => Number(r.creditPoint) || 0));
    return {
      key: g.key,
      proposalNo: g.proposalNo,
      year: g.year,
      yearRange: g.yearRange,
      rows: g.rows,
      majors: Array.from(g.majors),
      faculties: Array.from(g.faculties),
      participantsCount: g.rows.length,
      nims: Array.from(new Set(g.rows.map((r) => clean(r.nim)).filter(Boolean))),
      competitionName: orLabel(first.competitionName),
      competitionOrganizer: orLabel(first.competitionOrganizer),
      scope: orLabel(first.scope),
      category: orLabel(first.category),
      bentuk: orLabel(first.bentuk),
      cabang: orLabel(first.cabang),
      kategoriSimkatmawa: orLabel(first.kategoriSimkatmawa),
      status: orLabel(first.status),
      startDate: first.startDate,
      endDate: first.endDate,
      competitionLink: first.competitionLink,
      creditPoint,
    };
  });
}

const FILTER_FIELDS = [
  { key: 'years', rowField: '_year' },
  { key: 'faculties', rowField: 'faculty' },
  { key: 'majors', rowField: 'major' },
  { key: 'scopes', rowField: 'scope' },
  { key: 'categories', rowField: 'category' },
  { key: 'bentuks', rowField: 'bentuk' },
  { key: 'statuses', rowField: 'status' },
  { key: 'cabangs', rowField: 'cabang' },
  { key: 'kategoriSimkatmawas', rowField: 'kategoriSimkatmawa' },
];

export function emptyFilters() {
  return Object.fromEntries(FILTER_FIELDS.map((f) => [f.key, []]));
}

export function buildFilterOptions(rows) {
  const sets = Object.fromEntries(FILTER_FIELDS.map((f) => [f.key, new Set()]));
  for (const row of rows) {
    for (const f of FILTER_FIELDS) {
      const value = f.rowField === '_year' ? row._year : orLabel(row[f.rowField]);
      sets[f.key].add(value);
    }
  }
  const options = {};
  for (const f of FILTER_FIELDS) {
    const values = Array.from(sets[f.key]);
    options[f.key] = f.key === 'years' ? values.sort(sortByYearOrder) : values.sort((a, b) => a.localeCompare(b, 'id'));
  }
  return options;
}

export function filterRows(rows, filters) {
  return rows.filter((row) =>
    FILTER_FIELDS.every((f) => {
      const active = filters[f.key];
      if (!active || active.length === 0) return true;
      const value = f.rowField === '_year' ? row._year : orLabel(row[f.rowField]);
      return active.includes(value);
    })
  );
}

function countBy(list, keyFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

function sumBy(list, keyFn, valueFn) {
  const map = new Map();
  for (const item of list) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + valueFn(item));
  }
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

/** Count each achievement once per distinct value of a multi-value dimension
 *  (e.g. an achievement with a mixed-major team counts once for each major). */
function countByMultiDimension(achievements, dimensionKey) {
  const map = new Map();
  for (const a of achievements) {
    for (const v of a[dimensionKey]) {
      map.set(v, (map.get(v) || 0) + 1);
    }
  }
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function computeMetrics(filteredRows) {
  const achievements = groupAchievements(filteredRows);

  const totalPrestasi = achievements.length;
  const totalCreditPoints = achievements.reduce((s, a) => s + a.creditPoint, 0);
  const totalMahasiswaTerlibat = new Set(filteredRows.map((r) => clean(r.nim)).filter(Boolean)).size;
  const totalPartisipasi = filteredRows.length;
  const teamAchievements = achievements.filter((a) => a.participantsCount > 1).length;

  const yearsPresent = Array.from(new Set(achievements.map((a) => a.year))).sort(sortByYearOrder);

  const byYear = yearsPresent.map((year) => {
    const yearAchievements = achievements.filter((a) => a.year === year);
    return {
      name: year,
      yearRange: yearAchievements[0]?.yearRange || year,
      value: yearAchievements.length,
      creditPoints: yearAchievements.reduce((s, a) => s + a.creditPoint, 0),
      mahasiswa: new Set(
        filteredRows.filter((r) => r._year === year).map((r) => clean(r.nim)).filter(Boolean)
      ).size,
    };
  });

  const byYearScope = yearsPresent.map((year) => {
    const yearAchievements = achievements.filter((a) => a.year === year);
    const scopeCounts = countBy(yearAchievements, (a) => a.scope);
    const entry = { name: year };
    for (const { name, value } of scopeCounts) entry[name] = value;
    return entry;
  });

  const byMajor = countByMultiDimension(achievements, 'majors');
  const byFaculty = countByMultiDimension(achievements, 'faculties');
  const byCategory = countBy(achievements, (a) => a.category).sort((a, b) => b.value - a.value);
  const byScope = countBy(achievements, (a) => a.scope).sort((a, b) => b.value - a.value);
  const byStatus = countBy(achievements, (a) => a.status).sort((a, b) => b.value - a.value);
  const byBentuk = countBy(achievements, (a) => a.bentuk).sort((a, b) => b.value - a.value);
  const byCabang = countBy(achievements, (a) => a.cabang).sort((a, b) => b.value - a.value).slice(0, 10);
  const byKategoriSimkatmawa = countBy(achievements, (a) => a.kategoriSimkatmawa).sort((a, b) => b.value - a.value);
  const byOrganizer = countBy(achievements, (a) => a.competitionOrganizer)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  const creditByMajor = sumBy(
    achievements.flatMap((a) => a.majors.map((m) => ({ m, creditPoint: a.creditPoint }))),
    (x) => x.m,
    (x) => x.creditPoint
  ).sort((a, b) => b.value - a.value);

  return {
    achievements,
    totalPrestasi,
    totalCreditPoints,
    totalMahasiswaTerlibat,
    totalPartisipasi,
    teamAchievements,
    yearsPresent,
    byYear,
    byYearScope,
    byMajor,
    byFaculty,
    byCategory,
    byScope,
    byStatus,
    byBentuk,
    byCabang,
    byKategoriSimkatmawa,
    byOrganizer,
    creditByMajor,
  };
}

function pctChange(from, to) {
  if (from === 0) return to === 0 ? 0 : 100;
  return ((to - from) / from) * 100;
}

export function computeInsights(metrics) {
  const insights = [];
  const { byYear, byMajor, byFaculty, byScope, byCategory, totalPrestasi } = metrics;

  if (byYear.length >= 2) {
    const first = byYear[0];
    const last = byYear[byYear.length - 1];
    const change = pctChange(first.value, last.value);
    insights.push({
      tone: change >= 0 ? 'good' : 'critical',
      title:
        change >= 0
          ? `Prestasi naik ${change.toFixed(0)}% dari ${first.yearRange} ke ${last.yearRange}`
          : `Prestasi turun ${Math.abs(change).toFixed(0)}% dari ${first.yearRange} ke ${last.yearRange}`,
      detail: `Total prestasi ${first.name}: ${first.value} → ${last.name}: ${last.value}.`,
    });

    const cpChange = pctChange(first.creditPoints, last.creditPoints);
    insights.push({
      tone: cpChange >= 0 ? 'good' : 'warning',
      title:
        cpChange >= 0
          ? `Credit point institusi naik ${cpChange.toFixed(0)}%`
          : `Credit point institusi turun ${Math.abs(cpChange).toFixed(0)}%`,
      detail: `${first.name}: ${first.creditPoints.toFixed(0)} poin → ${last.name}: ${last.creditPoints.toFixed(0)} poin.`,
    });
  }

  if (byMajor.length > 0) {
    const top = byMajor[0];
    insights.push({
      tone: 'good',
      title: `Prodi terbaik: ${top.name}`,
      detail: `Menyumbang ${top.value} prestasi (${totalPrestasi ? ((top.value / totalPrestasi) * 100).toFixed(0) : 0}% dari total pada filter saat ini).`,
    });
    if (byMajor.length > 1) {
      const bottom = byMajor[byMajor.length - 1];
      insights.push({
        tone: 'warning',
        title: `Perlu perhatian: ${bottom.name}`,
        detail: `Baru menyumbang ${bottom.value} prestasi — peluang pembinaan lebih lanjut dibanding prodi lain.`,
      });
    }
  }

  if (byFaculty.length > 1) {
    const top = byFaculty[0];
    insights.push({
      tone: 'good',
      title: `Fakultas paling produktif: ${top.name}`,
      detail: `Berkontribusi ${top.value} prestasi pada cakupan data yang dipilih.`,
    });
  }

  if (byScope.length > 0) {
    const top = byScope[0];
    insights.push({
      tone: 'default',
      title: `Skala kompetisi dominan: ${top.name}`,
      detail: `${top.value} dari ${totalPrestasi} prestasi berskala ${top.name}.`,
    });
  }

  if (byCategory.length > 0) {
    const top = byCategory[0];
    insights.push({
      tone: 'default',
      title: `Kategori pencapaian terbanyak: ${top.name}`,
      detail: `${top.value} prestasi tercatat dengan kategori ini.`,
    });
  }

  return insights;
}
