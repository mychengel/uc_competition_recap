// Client-side aggregation over raw achievement rows.
// Core rule: rows sharing the same (year, Proposal No) are ONE achievement —
// whether it was a team or an individual entry, it is counted once.
//
// Field semantics (per the institution's real export):
//   - Status: the achievement RESULT (Juara 1/2/3, Finalis, Peserta …)
//   - Category: Akademik / Non Akademik (broad activity type)
//   - Bentuk: Daring / Luring (delivery mode)
//   - Participant: Individual / Team (participation form)
//   - Periode: the semester/year tag recorded in the data itself, which can
//     differ from which upload slot (TA/TA-1/…) a row came in on

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

function isWinningStatus(status) {
  return /juara/i.test(status);
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
      periode: orLabel(first.periode),
      scope: orLabel(first.scope),
      participant: orLabel(first.participant),
      represent: orLabel(first.represent),
      category: orLabel(first.category),
      bentuk: orLabel(first.bentuk),
      cabang: orLabel(first.cabang),
      kategoriSimkatmawa: orLabel(first.kategoriSimkatmawa),
      status: orLabel(first.status),
      isWinner: isWinningStatus(orLabel(first.status)),
      startDate: first.startDate,
      endDate: first.endDate,
      competitionLink: first.competitionLink,
      certificateUrl: first.certificateUrl,
      creditPoint,
    };
  });
}

const FILTER_FIELDS = [
  { key: 'years', rowField: '_year' },
  { key: 'periodes', rowField: 'periode' },
  { key: 'faculties', rowField: 'faculty' },
  { key: 'majors', rowField: 'major' },
  { key: 'scopes', rowField: 'scope' },
  { key: 'statuses', rowField: 'status' },
  { key: 'categories', rowField: 'category' },
  { key: 'bentuks', rowField: 'bentuk' },
  { key: 'participants', rowField: 'participant' },
  { key: 'representations', rowField: 'represent' },
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

/** Per-year breakdown of a multi-value dimension (major/faculty), e.g. for
 *  { name: 'IBM', 'TA-1': 40, TA: 92, total: 132 } style year-comparison
 *  charts. Only years actually present for that name get a key, so a chart
 *  reading the row's own keys naturally reflects the years available. */
function buildDimensionYearBreakdown(achievements, dimensionKey, valueFn, topN = 12) {
  const byNameYear = new Map(); // name -> { year -> sum }
  const totals = new Map(); // name -> total

  for (const a of achievements) {
    const v = valueFn(a);
    for (const name of a[dimensionKey]) {
      if (!byNameYear.has(name)) byNameYear.set(name, {});
      const yearMap = byNameYear.get(name);
      yearMap[a.year] = (yearMap[a.year] || 0) + v;
      totals.set(name, (totals.get(name) || 0) + v);
    }
  }

  const names = Array.from(totals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);

  return names.map((name) => {
    const yearMap = byNameYear.get(name) || {};
    const row = { name };
    for (const year of YEAR_ORDER) {
      if (yearMap[year] !== undefined) row[year] = yearMap[year];
    }
    row.total = totals.get(name) || 0;
    return row;
  });
}

export function computeMetrics(filteredRows) {
  const achievements = groupAchievements(filteredRows);

  const totalPrestasi = achievements.length;
  const totalCreditPoints = achievements.reduce((s, a) => s + a.creditPoint, 0);
  const totalMahasiswaTerlibat = new Set(filteredRows.map((r) => clean(r.nim)).filter(Boolean)).size;
  const totalPartisipasi = filteredRows.length;
  const teamAchievements = achievements.filter((a) => a.participantsCount > 1).length;
  const winningAchievements = achievements.filter((a) => a.isWinner).length;
  const winRate = totalPrestasi ? (winningAchievements / totalPrestasi) * 100 : 0;

  const yearsPresent = Array.from(new Set(achievements.map((a) => a.year))).sort(sortByYearOrder);

  const byYear = yearsPresent.map((year) => {
    const yearAchievements = achievements.filter((a) => a.year === year);
    const winners = yearAchievements.filter((a) => a.isWinner).length;
    return {
      name: year,
      yearRange: yearAchievements[0]?.yearRange || year,
      value: yearAchievements.length,
      creditPoints: yearAchievements.reduce((s, a) => s + a.creditPoint, 0),
      mahasiswa: new Set(
        filteredRows.filter((r) => r._year === year).map((r) => clean(r.nim)).filter(Boolean)
      ).size,
      winRate: yearAchievements.length ? (winners / yearAchievements.length) * 100 : 0,
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
  const byMajorYear = buildDimensionYearBreakdown(achievements, 'majors', () => 1);
  const byFacultyYear = buildDimensionYearBreakdown(achievements, 'faculties', () => 1);
  const creditByMajorYear = buildDimensionYearBreakdown(achievements, 'majors', (a) => a.creditPoint);
  const byStatus = countBy(achievements, (a) => a.status).sort((a, b) => b.value - a.value);
  const byCategory = countBy(achievements, (a) => a.category).sort((a, b) => b.value - a.value);
  const byBentuk = countBy(achievements, (a) => a.bentuk).sort((a, b) => b.value - a.value);
  const byParticipant = countBy(achievements, (a) => a.participant).sort((a, b) => b.value - a.value);
  const byRepresent = countBy(achievements, (a) => a.represent).sort((a, b) => b.value - a.value);
  const byScope = countBy(achievements, (a) => a.scope).sort((a, b) => b.value - a.value);
  const byCabang = countBy(achievements, (a) => a.cabang).sort((a, b) => b.value - a.value).slice(0, 10);
  const byKategoriSimkatmawa = countBy(achievements, (a) => a.kategoriSimkatmawa).sort((a, b) => b.value - a.value);
  const byOrganizer = countBy(achievements, (a) => a.competitionOrganizer)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return {
    achievements,
    totalPrestasi,
    totalCreditPoints,
    totalMahasiswaTerlibat,
    totalPartisipasi,
    teamAchievements,
    winningAchievements,
    winRate,
    yearsPresent,
    byYear,
    byYearScope,
    byMajor,
    byFaculty,
    byMajorYear,
    byFacultyYear,
    creditByMajorYear,
    byStatus,
    byCategory,
    byBentuk,
    byParticipant,
    byRepresent,
    byScope,
    byCabang,
    byKategoriSimkatmawa,
    byOrganizer,
  };
}

function pctChange(from, to) {
  if (from === 0) return to === 0 ? 0 : 100;
  return ((to - from) / from) * 100;
}

export function computeInsights(metrics) {
  const insights = [];
  const { byYear, byMajor, byFaculty, byScope, byStatus, byCategory, totalPrestasi, winRate, winningAchievements } =
    metrics;

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

    const wrChange = last.winRate - first.winRate;
    insights.push({
      tone: wrChange >= 0 ? 'good' : 'warning',
      title:
        wrChange >= 0
          ? `Win rate naik ${wrChange.toFixed(0)} poin persentase`
          : `Win rate turun ${Math.abs(wrChange).toFixed(0)} poin persentase`,
      detail: `Proporsi prestasi yang meraih gelar juara: ${first.name} ${first.winRate.toFixed(0)}% → ${last.name} ${last.winRate.toFixed(0)}%.`,
    });
  } else if (totalPrestasi > 0) {
    insights.push({
      tone: winRate >= 40 ? 'good' : 'default',
      title: `Win rate juara: ${winRate.toFixed(0)}%`,
      detail: `${winningAchievements} dari ${totalPrestasi} prestasi berhasil meraih gelar juara.`,
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

  if (byStatus.length > 0) {
    const top = byStatus[0];
    insights.push({
      tone: 'default',
      title: `Tingkat pencapaian terbanyak: ${top.name}`,
      detail: `${top.value} prestasi tercatat dengan hasil ini.`,
    });
  }

  if (byCategory.length > 1) {
    const top = byCategory[0];
    insights.push({
      tone: 'default',
      title: `Tipe kegiatan dominan: ${top.name}`,
      detail: `${top.value} dari ${totalPrestasi} prestasi bertipe ${top.name}.`,
    });
  }

  return insights;
}
