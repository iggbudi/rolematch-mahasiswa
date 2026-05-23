'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultData {
  nama: string;
  gender: string;
  total: number;
  interpText: string;
  answers: number[];
}

const statements = [
  "Energi terkuras setelah acara sosial ramai",
  "Membutuhkan waktu sendirian untuk pulih",
  "Lelah fisik & mental di keramaian lama",
  "Lebih nyaman jadi anggota pendukung daripada ketua kelompok",
  "Lelah berinteraksi dengan banyak orang baru di kegiatan kampus",
  "Lebih suka mengerjakan perencanaan daripada berhadapan dengan peserta",
  "Cenderung mengamati dulu sebelum bicara di diskusi",
  "Proses informasi di kepala sebelum mengutarakan",
  "Konsentrasi lebih tinggi saat kerja sendirian",
  "Konsentrasi terganggu di tempat ramai saat kerja kelompok",
  "Lebih suka koordinasi lewat chat daripada rapat langsung",
  "Mudah kewalahan oleh stimulasi berlebih",
  "Senang menghabiskan waktu sendirian di kos",
  "Tidak merasa kesepian saat sendiri"
];

const sections = [
  {
    title: "Bagian 1: Pengisian Energi di Kampus",
    desc: "Mengukur bagaimana Anda memulihkan energi setelah kegiatan sosial dan akademik.",
    questions: [0, 1, 2]
  },
  {
    title: "Bagian 2: Interaksi dalam Kegiatan Kampus",
    desc: "Mengukur preferensi Anda saat berinteraksi di organisasi, kepanitiaan, dan kerja kelompok.",
    questions: [3, 4, 5, 6]
  },
  {
    title: "Bagian 3: Gaya Kerja dalam Tim & Organisasi",
    desc: "Mengukur pola kerja dan komunikasi Anda dalam proyek kelompok serta kegiatan organisasi.",
    questions: [7, 8, 9, 10]
  },
  {
    title: "Bagian 4: Respons Terhadap Lingkungan",
    desc: "Mengukur sensitivitas Anda terhadap stimulasi dan preferensi lingkungan kerja.",
    questions: [11, 12, 13]
  }
];

const fullStatements = [
  "Saya merasa energi saya terkuras setelah berada di acara sosial yang ramai atau berinteraksi dengan banyak orang.",
  "Saya mutlak membutuhkan waktu sendirian untuk memulihkan diri setelah hari yang sibuk di kampus.",
  "Berada di keramaian (kelas, acara, atau kegiatan) dalam waktu lama membuat saya lelah secara fisik dan mental.",
  "Dalam kerja kelompok tugas kuliah, saya lebih nyaman menjadi anggota yang mendukung dari belakang daripada menjadi ketua kelompok.",
  "Saya merasa lelah jika harus banyak berinteraksi dengan orang-orang baru saat mengikuti kegiatan orientasi, UKM, atau kepanitiaan.",
  "Saya lebih menikmati mengerjakan bagian perencanaan dan detail acara daripada bagian yang harus berhadapan langsung dengan peserta.",
  "Dalam diskusi kelas atau rapat organisasi, saya cenderung mengamati dan mendengarkan dulu sebelum berbicara.",
  "Saya selalu memproses informasi dan menyusun kata-kata di dalam kepala sebelum mengutarakannya.",
  "Saya memiliki konsentrasi yang jauh lebih tinggi ketika mengerjakan tugas atau proyek sendirian.",
  "Saat mengerjakan proyek kelompok di tempat yang ramai atau banyak interupsi, konsentrasi saya cepat terganggu.",
  "Dalam kepanitiaan atau kerja kelompok, saya lebih suka mengkoordinasikan lewat chat daripada rapat langsung.",
  "Berada di lingkungan yang terlalu bising atau penuh stimulasi membuat saya merasa kewalahan.",
  "Menghabiskan waktu sendirian di kamar kos untuk mengerjakan tugas atau hobi adalah hal yang menyenangkan bagi saya.",
  "Saya tidak merasa kesepian ketika sedang tidak ada orang lain di sekitar saya."
];

export default function Kuesioner() {
  const [nama, setNama] = useState('');
  const [gender, setGender] = useState('');
  const [answers, setAnswers] = useState<number[]>(Array(14).fill(0));
  const [result, setResult] = useState<ResultData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleAnswer = (index: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      toast.error("Nama lengkap wajib diisi");
      return;
    }
    if (!gender) {
      toast.error("Jenis kelamin wajib dipilih");
      return;
    }

    const unanswered = answers.findIndex(a => a === 0);
    if (unanswered !== -1) {
      toast.error(`Mohon jawab pertanyaan nomor ${unanswered + 1}`);
      return;
    }

    const total = answers.reduce((sum, val) => sum + val, 0);

    let interpText = '';
    if (total <= 28) interpText = 'Anda cenderung Ekstrovert';
    else if (total <= 42) interpText = 'Anda termasuk Ambivert (campuran)';
    else if (total <= 56) interpText = 'Anda cenderung Introvert';
    else interpText = 'Anda sangat Introvert';

    setResult({
      nama: nama.trim(),
      gender,
      total,
      interpText,
      answers: [...answers]
    });

    // Reset AI analysis
    setAiAnalysis('');

    toast.success('Kuesioner berhasil disubmit!');
  };

  const analyzeWithAI = async () => {
    if (!result) return;

    setIsLoadingAI(true);
    setAiAnalysis('');

    // Buat teks jawaban
    let answersText = '';
    result.answers.forEach((val, i) => {
      answersText += `${i + 1}. ${statements[i]}: ${val}\n`;
    });

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: result.nama,
          gender: result.gender,
          total: result.total,
          interpText: result.interpText,
          answersText
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Gagal mendapatkan analisis');
      }

      const data = await response.json();
      setAiAnalysis(data.analysis);
      toast.success('Analisis AI berhasil dibuat!');

    } catch (error: any) {
      toast.error('Gagal mendapatkan analisis dari AI: ' + error.message);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const resetForm = () => {
    setNama('');
    setGender('');
    setAnswers(Array(14).fill(0));
    setResult(null);
    setAiAnalysis('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const editAnswers = () => {
    if (!result) return;
    // Restore previous answers and identity
    setNama(result.nama);
    setGender(result.gender);
    setAnswers([...result.answers]);
    setAiAnalysis('');
    setResult(null);
    // Scroll to top smoothly
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
    toast.info('Silakan edit jawaban Anda');
  };

  // Progress calculation
  const totalQuestions = 14;
  const answeredCount = answers.filter(a => a !== 0).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  const getInterpColor = (text: string) => {
    if (text.includes('Ekstrovert')) return 'bg-green-100 text-green-700 border-green-300';
    if (text.includes('Ambivert')) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (text.includes('sangat Introvert')) return 'bg-purple-100 text-purple-700 border-purple-300';
    return 'bg-indigo-100 text-indigo-700 border-indigo-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 py-8 px-4">
      <div className="max-w-[780px] mx-auto bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-1.5 sm:mb-2">🎯 RoleMatch Mahasiswa</h1>
        <p className="text-center text-zinc-500 mb-6 sm:mb-8 text-sm sm:text-base">Temukan peran yang paling cocok untukmu di organisasi kampus dan dunia kerja</p>

        {/* Progress Indicator */}
        {!result && (
          <div className="mb-5 sm:mb-6 sticky top-3 sm:top-4 z-10 bg-white/95 backdrop-blur border border-zinc-200 rounded-2xl p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5 sm:mb-2">
              <span className="font-medium text-zinc-700">Progress Pengisian</span>
              <span className="font-semibold text-indigo-600">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <div 
              className="h-2.5 bg-zinc-200 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress pengisian kuesioner: ${answeredCount} dari ${totalQuestions} pertanyaan`}
            >
              <div 
                className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-300 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-right text-xs text-zinc-500 mt-1">{progressPercent}% selesai</div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
            {/* Identitas */}
            <div>
              <div className="text-lg font-semibold text-indigo-600 mb-3 border-b pb-1">Identitas Responden</div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full border-2 border-zinc-200 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Jenis Kelamin</label>
                <div className="flex gap-3 sm:gap-4">
                  {['Laki-laki', 'Perempuan'].map((g) => (
                    <label key={g} className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 cursor-pointer transition text-sm sm:text-base ${gender === g ? 'border-indigo-500 bg-indigo-50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={gender === g}
                        onChange={(e) => setGender(e.target.value)}
                        className="accent-indigo-600"
                      />
                      <span>{g === 'Laki-laki' ? '👨' : '👩'} {g}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Panduan */}
            <div className="bg-indigo-50 border-2 border-indigo-200 rounded-2xl p-4 sm:p-5">
              <div className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">📌 Panduan Skala Jawaban</div>
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center text-[11px] sm:text-sm">
                {[1,2,3,4,5].map(n => (
                  <div key={n} className="bg-white rounded-lg py-1.5 sm:py-2 border">
                    <div className="font-bold text-indigo-600">{n}</div>
                    <div className="text-[8px] sm:text-[9px] leading-tight text-zinc-500">
                      {n === 1 && 'Sangat Tidak'}
                      {n === 2 && 'Tidak'}
                      {n === 3 && 'Netral'}
                      {n === 4 && 'Setuju'}
                      {n === 5 && 'Sangat Setuju'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pertanyaan */}
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                 <div className="text-base sm:text-lg font-semibold text-indigo-600 mb-1">{section.title}</div>
                 <p className="text-xs sm:text-sm text-zinc-500 mb-3 sm:mb-4">{section.desc}</p>

                 {section.questions.map((qIdx) => (
                   <div key={qIdx} className="question-card p-4 sm:p-[16px_18px]">
                     <div className="mb-3 text-sm sm:text-[15px]">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold mr-2">{qIdx + 1}</span>
                      {fullStatements[qIdx]}
                    </div>
                    <div className="flex gap-1.5 sm:gap-2">
                      {[1,2,3,4,5].map(val => {
                        const labels = ['Sangat Tidak', 'Tidak', 'Netral', 'Setuju', 'Sangat Setuju'];
                        const isSelected = answers[qIdx] === val;
                        return (
                          <label 
                            key={val}
                            htmlFor={`q${qIdx}_${val}`}
                            aria-label={`${labels[val-1]} (${val})`}
                            className={`flex-1 flex flex-col items-center justify-center py-2.5 sm:py-3 border-2 rounded-2xl cursor-pointer transition-all active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${isSelected 
                              ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-indigo-600 shadow-sm' 
                              : 'border-zinc-200 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 text-zinc-700'}`}
                          >
                            <input
                              type="radio"
                              name={`q${qIdx}`}
                              id={`q${qIdx}_${val}`}
                              checked={isSelected}
                              onChange={() => handleAnswer(qIdx, val)}
                              className="sr-only"
                            />
                            <span className="text-lg sm:text-xl font-bold leading-none">{val}</span>
                            <span className="text-[8.5px] sm:text-[9px] leading-tight mt-1 text-center opacity-90">{labels[val-1]}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-lg font-semibold rounded-2xl hover:brightness-105 transition"
            >
              Kirim &amp; Lihat Hasil
            </button>
          </motion.form>
        ) : (
          /* HASIL */
          <motion.div
            key="result"
            className="result-box"
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="text-center mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold">✅ Hasil RoleMatch Mahasiswa</h2>
              <p className="mt-1.5 sm:mt-2 text-base sm:text-lg">
                Halo, <strong>{result.nama}</strong> ({result.gender})
              </p>
            </div>

            <div className="bg-white rounded-2xl border-2 border-violet-300 p-4 sm:p-5 mb-5 text-center">
              <div className="text-4xl sm:text-5xl font-bold text-indigo-600">{result.total} <span className="text-xl sm:text-2xl font-normal text-zinc-400">/ 70</span></div>
              <div className="text-xs sm:text-sm text-zinc-500 mt-1">Skor Total</div>
            </div>

            <div className={`text-center py-3 rounded-xl border font-semibold mb-6 ${getInterpColor(result.interpText)}`}>
              {result.interpText}
            </div>

            {/* Ringkasan Jawaban */}
            <div className="mb-6">
              <div className="font-semibold mb-2">📝 Ringkasan Jawaban</div>
              <div className="bg-white rounded-xl p-4 text-sm space-y-1.5 max-h-72 overflow-auto border">
                {result.answers.map((val, i) => (
                  <div key={i} className="flex justify-between border-b pb-1 last:border-0">
                    <span className="text-zinc-600">{i + 1}. {statements[i]}</span>
                    <span className="font-semibold text-indigo-600">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tombol AI */}
            <button
              onClick={analyzeWithAI}
              disabled={isLoadingAI}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-400 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition"
            >
              {isLoadingAI ? '⏳ Menganalisis dengan AI...' : '✨ Dapatkan Rekomendasi Peran & Karir dari AI'}
            </button>

            {isLoadingAI && (
              <div className="mt-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm text-emerald-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="animate-pulse">●</span>
                  <span className="font-medium">AI sedang menganalisis pola jawaban Anda...</span>
                </div>
                <div className="text-xs opacity-75">Ini biasanya memakan waktu 3–8 detik.</div>
              </div>
            )}

            {/* Hasil AI */}
            {aiAnalysis && (
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="font-semibold text-emerald-700 flex items-center gap-2">
                    ✨ Analisis Mendalam dari AI
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiAnalysis);
                      toast.success('Analisis berhasil disalin ke clipboard');
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl border border-emerald-200 hover:bg-emerald-50 text-emerald-700 flex items-center gap-1.5 transition"
                  >
                    📋 Salin
                  </button>
                </div>
                <div className="ai-result text-sm leading-relaxed">
                  {aiAnalysis.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 last:mb-0">{line}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={editAnswers}
                className="flex-1 py-3 border-2 border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-2xl font-medium text-sm transition"
              >
                ✏️ Edit Jawaban
              </button>
              <button
                onClick={resetForm}
                className="flex-1 py-3 border border-zinc-300 hover:bg-zinc-100 rounded-2xl font-medium text-sm transition"
              >
                Isi Ulang
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>

      <p className="text-center text-white/70 text-xs mt-6">RoleMatch Mahasiswa • Rekomendasi peran kampus & persiapan karir • Data hanya tersimpan di browser kamu</p>
    </div>
  );
}
