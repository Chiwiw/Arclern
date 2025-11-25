| No | Nama               | NRP      |
|----|----------------    |----------|
| 1  |Hanif Mawla Faizi   |5027241064|

# 🌱 Arclern — Skill Progress Tracker

Arclern adalah aplikasi web yang membantu pengguna—khususnya mahasiswa dan pembelajar mandiri—untuk **melacak perkembangan skill yang sedang dipelajari**, lengkap dengan pencatatan progres, level kompetensi, dan dokumentasi berupa file atau gambar.

Daripada belajar banyak hal tetapi lupa sudah sejauh apa peningkatan yang dicapai, Arclern hadir sebagai ruang pribadi untuk menyimpan perjalanan belajar secara terstruktur dan bermakna.

---

## 🎯 Tujuan Arclern

Banyak orang belajar banyak skill sekaligus (coding, UI/UX, editing video, bahasa asing, dll), namun:

- Tidak tahu posisi level skill saat ini
- Kehilangan jejak materi terakhir yang dipelajari
- Tidak punya dokumentasi progres
- Tidak sadar sudah berkembang sejauh apa

Arclern membantu user untuk:

- **Mendokumentasikan skill yang sedang dipelajari**
- **Melacak level skill (Beginner → Advanced → Expert)**
- **Mencatat update progress & refleksi belajar**
- **Mengunggah file sebagai bukti pembelajaran**
- **Melihat progres mereka dalam dashboard personal**

Aplikasi ini bersifat personal — **skill milik user hanya bisa dilihat oleh user itu sendiri**, bukan social sharing platform.

---

## ✨ Fitur Utama

| Fitur | Status |
|-------|--------|
| Register & Login (JWT Auth) | ✔️ |
| Protected Route (Token-based) | ✔️ |
| CRUD Skill (Create, Read, Update, Delete) | ✔️ |
| File / Image Upload | ✔️ |
| Dashboard Skill User | ✔️ |
| Only Self Data (No public browsing) | ✔️ |

---

## 🛠️ Tech Stack

### **Frontend**
- React + TypeScript
- TailwindCSS
- React Router
- Axios
- Context API (Auth State)

### **Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt
- Multer (File Upload)

---

## 📡 API Endpoint Summary

### 🔐 Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registrasi akun baru |
| POST | `/api/auth/login` | Login user & kirim JWT |

### 🧩 Skills (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | Ambil semua skill milik user |
| POST | `/api/skills` | Tambah skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Hapus skill |
| POST | `/api/skills/:id/upload` | Upload file bukti skill |

Semua endpoint skill **wajib mengirimkan token** di header:

## 🚀 Cara Menjalankan Proyek

### Backend
```sh
cd backend
npm install
npm run dev
```

### Frontend
```sh
cd frontend
npm install
npm run dev
```

## 📄 License

Proyek ini dibuat untuk tujuan pembelajaran, tugas perkuliahan, dan eksplorasi teknologi.
Feel free to explore, fork, atau kembangkan lebih lanjut.

## 👤 Dibuat oleh

Hanif (Arclern Project Owner & Developer)

“Skill isn’t what you claim — it’s what you consistently build.”
— Arclern Philosophy
