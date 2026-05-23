import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY belum diset. Silakan isi di file .env.local (untuk development) atau Environment Variables di Vercel.' },
      { status: 500 }
    );
  }

  try {
    const { nama, gender, total, interpText, answersText } = await request.json();

    const systemPrompt = `Kamu adalah seorang career coach dan pembina organisasi mahasiswa yang berpengalaman di Indonesia. 
Kamu sangat memahami dinamika kehidupan kampus, kepanitiaan, organisasi mahasiswa (BEM, HMJ, UKM, Panitia), serta persiapan karir mahasiswa.
Tugasmu adalah menganalisis hasil kuesioner gaya kerja dan energi sosial seorang mahasiswa, lalu memberikan rekomendasi yang sangat praktis, spesifik, dan actionable untuk dua konteks utama: peran di organisasi kampus dan persiapan karir.
Gunakan bahasa Indonesia yang hangat, suportif, dan tidak terlalu formal. Hindari jawaban generik. Selalu hubungkan analisis dengan jawaban spesifik responden.`;

    const userPrompt = `Berikut adalah hasil kuesioner "RoleMatch Mahasiswa" dari ${nama} (${gender}).

SKOR TOTAL: ${total} dari 70
KATEGORI: ${interpText}

Jawaban lengkap (skala 1-5):
${answersText}

Berdasarkan jawaban di atas, berikan analisis dalam struktur berikut dengan bahasa yang jelas dan konkret:

1. **Ringkasan Gaya Kerja di Kampus**  
   (Bagaimana mahasiswa ini biasanya berperilaku dalam kerja kelompok, organisasi, dan kegiatan kampus)

2. **Rekomendasi Peran di Organisasi Kampus**  
   Berikan 4–5 peran yang paling cocok (contoh: Ketua Divisi Acara, Sekretaris, Humas, Sponsorship, Bendahara, Koordinator Lapangan, Content Creator, dll). Sertakan alasan singkat mengapa cocok berdasarkan pola jawabannya.

3. **Rekomendasi Bidang Karir Awal**  
   Berikan 3 bidang karir yang paling sesuai beserta alasan singkat. Fokus pada pekerjaan entry-level yang relevan dengan mahasiswa lulusan baru.

4. **Kekuatan Utama** yang bisa dimanfaatkan selama kuliah dan di dunia kerja

5. **Tantangan yang Mungkin Dihadapi** sebagai mahasiswa + cara mengatasinya secara realistis

6. **Saran Pengembangan Diri** (minimal 3 saran konkret) yang bisa dilakukan selama kuliah

7. **Pesan Penutup** yang memotivasi

Panjang total analisis sekitar 280–380 kata. Buat tetap personal dan menghindari kalimat klise.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
                        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Gagal memanggil Groq');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return NextResponse.json({ analysis });

  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan saat menganalisis' },
      { status: 500 }
    );
  }
}
