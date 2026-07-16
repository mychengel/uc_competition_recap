# uc_competition_recap

Dashboard web untuk merekap dan melaporkan hasil kompetisi/prestasi mahasiswa dari data
Excel (.xlsx), dengan perbandingan antar tahun ajaran (TA, TA-1, TA-2, TA-3), filter
multi-dimensi, insight otomatis, dan histori report.

## Struktur proyek

- `client/` — frontend React (Vite + Tailwind CSS v4 + Recharts + Framer Motion)
- `server/` — backend Express (upload & parsing file .xlsx, penyimpanan metadata report)
- `data/` — penyimpanan file .xlsx yang diupload dan `data.json` (metadata seluruh report)

## Menjalankan secara lokal

```bash
npm run install:all   # install dependency client & server
npm run dev            # menjalankan server (port 4000) & client dev server (port 5173) bersamaan
```

Buka `http://localhost:5173` saat development (proxy otomatis ke server di port 4000).

## Build untuk produksi

```bash
npm run build   # build frontend ke client/dist
npm start        # menjalankan server Express yang juga menyajikan hasil build client
```

Server berjalan di `http://localhost:4000` (dapat diubah lewat env `PORT`).

## Autentikasi pembuatan report

Pembuatan report baru memerlukan kode autentikasi (default: `SAUCKEREN`, dapat diubah
lewat env `REPORT_AUTH_CODE` di server).

## Format data Excel

Setiap file .xlsx yang diupload harus mengikuti kolom pada `data/template.xlsx`, dengan
baris pertama sebagai header. Baris dengan `Proposal No` yang sama dihitung sebagai satu
prestasi (baik individu maupun tim).
