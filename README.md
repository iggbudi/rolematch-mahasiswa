# RoleMatch Mahasiswa

**RoleMatch Mahasiswa** adalah aplikasi web berbasis Next.js yang membantu mahasiswa menemukan **peran yang paling cocok** di organisasi kampus (kepanitiaan, BEM, HMJ, UKM) serta rekomendasi bidang karir awal berdasarkan gaya kerja dan energi sosial mereka.

Aplikasi ini menggunakan kuesioner interaktif + analisis mendalam yang didukung oleh **Artificial Intelligence (Groq)**.

---

## 🎯 Latar Belakang Masalah

Banyak mahasiswa mengalami kesulitan dalam:

- Memilih organisasi atau kepanitiaan yang sesuai dengan karakter dan energi mereka.
- Menentukan peran yang tepat di dalam organisasi (misalnya: ketua divisi, humas, sponsorship, sekretaris, dll).
- Memahami kekuatan dan kelemahan diri terkait kerja tim, leadership, dan komunikasi.
- Menyiapkan diri untuk dunia kerja setelah lulus kuliah.

Saat ini, tes kepribadian yang ada di internet masih terlalu umum dan tidak memberikan rekomendasi yang **spesifik untuk konteks kehidupan mahasiswa Indonesia**.

---

## 💡 Kenapa RoleMatch Mahasiswa Menjadi Solusi?

RoleMatch Mahasiswa dirancang khusus untuk mahasiswa dengan pendekatan sebagai berikut:

- **Konteks Lokal**: Pertanyaan disesuaikan dengan realita kehidupan kampus (kerja kelompok, kepanitiaan, UKM, presentasi, deadline, dll).
- **Dua Fokus Utama**: Rekomendasi peran di **organisasi kampus** + rekomendasi **bidang karir awal**.
- **Analisis Berbasis AI**: Menggunakan model AI yang powerful untuk memberikan insight yang personal dan actionable, bukan jawaban generik.
- **Mudah Digunakan**: Interface modern, mobile-friendly, dan hasil langsung bisa disalin atau digunakan untuk refleksi diri.

---

## ✨ Fitur Utama

- Kuesioner 14 pertanyaan yang relevan dengan kehidupan mahasiswa
- 4 bagian pengukuran: Energi, Interaksi Kampus, Gaya Kerja Tim, dan Respons Lingkungan
- Analisis AI yang menghasilkan:
  - Ringkasan gaya kerja di kampus
  - Rekomendasi peran di organisasi kampus (4–5 rekomendasi)
  - Rekomendasi bidang karir awal
  - Kekuatan, tantangan, dan saran pengembangan diri
- Progress bar real-time
- Fitur Edit Jawaban
- Tombol Copy hasil analisis
- Desain modern dan responsif

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI/UX**: Sonner (Toast), Framer Motion (Animation)
- **AI**: Groq API (`llama-3.3-70b-versatile`)

---

## 🤖 AI & Model yang Digunakan

Aplikasi ini menggunakan **Groq API** dengan model:

> **llama-3.3-70b-versatile**

Model ini dipilih karena:
- Kecepatan respon yang sangat cepat
- Kualitas analisis yang baik untuk bahasa Indonesia
- Gratis untuk penggunaan dengan rate limit yang cukup untuk proyek pembelajaran

---

## 🔑 Cara Mendapatkan Groq API Key

1. Buka website [https://console.groq.com](https://console.groq.com)
2. Daftar / Login menggunakan akun Google atau GitHub
3. Setelah masuk, klik menu **API Keys**
4. Klik tombol **Create API Key**
5. Beri nama key (contoh: `rolematch-mahasiswa`)
6. Copy API Key yang muncul (format: `gsk_xxxxxxxxxxxxxxxxxxxxxxxx`)
7. **Jangan share** API Key ini ke siapapun

---

## 📦 Instalasi Lokal

### Prasyarat

- Node.js 18 atau lebih baru
- npm / yarn / pnpm

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/username/rolematch-mahasiswa.git
cd rolematch-mahasiswa

# 2. Install dependencies
npm install

# 3. Buat file environment
cp .env.example .env.local
```

### 4. Isi Groq API Key

Buka file `.env.local` dan masukkan API Key kamu:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

---

## 🚀 Deploy ke Vercel

### Cara Termudah (Recommended)

1. Push repository ini ke GitHub
2. Buka [https://vercel.com](https://vercel.com)
3. Login menggunakan GitHub
4. Klik **Add New Project** → pilih repository `rolematch-mahasiswa`
5. Di bagian **Environment Variables**, tambahkan:

   | Name            | Value                              |
   |-----------------|------------------------------------|
   | `GROQ_API_KEY`  | `gsk_xxxxxxxxxxxxxxxxxxxxxxxx`     |

6. Klik **Deploy**

Setelah selesai, aplikasi akan otomatis di-deploy dan bisa diakses secara publik.

---

## 📌 Catatan Penting

- API Key Groq **wajib diisi** agar fitur analisis AI bisa berjalan.
- Data kuesioner **hanya disimpan di browser** (tidak ada database).
- Project ini dibuat untuk tujuan **pembelajaran** dan bisa dikembangkan lebih lanjut.

---

## 📄 Lisensi

Project ini dibuat untuk keperluan edukasi dan pengembangan diri mahasiswa.

---

Dibuat dengan ❤️ untuk membantu mahasiswa Indonesia menemukan peran yang tepat di kampus dan karir.
