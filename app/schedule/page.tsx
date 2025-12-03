import Navbar from "@/components/navbar"
import { Users, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Jadwal Kegiatan - PP GKPI PAMEN",
  description: "Jadwal kegiatan PP GKPI PAMEN",
}

export default function Schedule() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 text-center text-foreground animate-fade-in">Jadwal Kegiatan</h1>

        <div className="space-y-6">
          {/* Pendalaman Alkitab */}
          <div
            className="border-2 border-primary/30 rounded-lg p-6 bg-gradient-to-r from-primary/5 to-transparent hover:border-primary/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-lg p-4 text-center w-24 flex-shrink-0 shadow-lg">
                <div className="text-xs font-semibold">JUM'AT</div>
                <div className="text-2xl font-bold">19:30</div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Pendalaman Alkitab</h3>
                <p className="text-foreground/70 text-lg mb-4">
                  Pendalaman alkitab dilaksanakan pada pukul 19.30 setiap hari Jumat. Kami berkumpul untuk memperdalam
                  pemahaman kita tentang Firman Tuhan bersama-sama.
                </p>
                <div className="flex items-center gap-2 text-foreground/60">
                  <span>📍</span>
                  <span>Gereja GKPI Pamen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Latihan */}
          <div
            className="border-2 border-accent/30 rounded-lg p-6 bg-gradient-to-r from-accent/5 to-transparent hover:border-accent/50 hover:shadow-lg transition-all duration-300 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-accent to-accent/80 text-accent-foreground rounded-lg p-4 text-center w-24 flex-shrink-0 shadow-lg">
                <div className="text-xs font-semibold">KAMIS & JUM'AT</div>
                <div className="text-2xl font-bold">19:30</div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-foreground">Latihan Rutin</h3>
                <p className="text-foreground/70 text-lg mb-4">
                  Latihan dilakukan 2x seminggu pada hari Kamis dan Jumat jam 19.30. Program ini dirancang untuk
                  meningkatkan keterampilan dan kebersamaan dalam pelayanan.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-foreground/60">
                    <span>📍</span>
                    <span>Gereja GKPI Pamen</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground/60">
                    <Users size={18} />
                    <span>Semua anggota PP GKPI Pamen diundang</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan */}
        <div
          className="mt-12 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 border-2 border-yellow-200/50 rounded-lg p-6 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-foreground">
            <AlertCircle className="text-yellow-600" size={20} />
            Catatan Penting
          </h3>
          <ul className="text-foreground/80 space-y-2">
            <li>• Harap tiba 10 menit sebelum acara dimulai</li>
            <li>• Pakaian resmi dianjurkan untuk pendalaman alkitab</li>
            <li>• Bawa Alkitab atau gunakan aplikasi digital</li>
            <li>• Informasi lebih lanjut hubungi ketua divisi</li>
          </ul>
        </div>
      </section>
    </main>
  )
}
