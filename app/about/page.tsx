import Navbar from "@/components/navbar"
import { BookOpen, Zap, Hand as Hands } from "lucide-react"

export const metadata = {
  title: "Tentang Kami - PP GKPI PAMEN",
  description: "Pelajari lebih lanjut tentang PP GKPI PAMEN dan program-program kami",
}

export default function About() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center text-foreground animate-fade-in">Tentang Kami</h1>

        <div
          className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-lg mb-8 border border-primary/20 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Apa itu PP GKPI PAMEN?</h2>
          <p className="text-foreground/80 leading-relaxed text-lg">
            PP GKPI Pamen merupakan perkumpulan pemuda-pemuda gereja gkpi pamen, yang dimana perkumpulan ini membantu
            pemuda/i dalam melakukan pelayanan dan ibadah terhadap tuhan. Kami adalah komunitas yang solid dan
            berkomitmen untuk mendekatkan diri kepada Tuhan melalui berbagai kegiatan spiritual dan sosial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div
            className="border-l-4 border-primary pl-6 bg-card p-4 rounded-lg animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <h3 className="text-xl font-semibold mb-3 text-foreground">Visi Kami</h3>
            <p className="text-foreground/70">
              Menjadi komunitas pemuda-pemuda yang kuat dalam iman, dedikasi, dan pelayanan kepada Tuhan serta
              masyarakat sekitar.
            </p>
          </div>

          <div
            className="border-l-4 border-accent pl-6 bg-card p-4 rounded-lg animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <h3 className="text-xl font-semibold mb-3 text-foreground">Misi Kami</h3>
            <p className="text-foreground/70">
              Melayani dengan sepenuh hati, mendalami Alkitab, dan membangun kebersamaan yang solid dalam iman Kristen.
            </p>
          </div>
        </div>

        <div className="bg-card p-8 rounded-lg border border-border animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <h3 className="text-2xl font-semibold mb-6 text-foreground">Program Utama Kami</h3>
          <ul className="space-y-4">
            <li className="flex gap-4 hover:bg-secondary/50 p-3 rounded-lg transition-all duration-300">
              <div className="flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary mt-1" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Pendalaman Alkitab</h4>
                <p className="text-foreground/70">Dilaksanakan pada pukul 19.30 setiap hari Jumat</p>
              </div>
            </li>
            <li className="flex gap-4 hover:bg-secondary/50 p-3 rounded-lg transition-all duration-300">
              <div className="flex-shrink-0">
                <Zap className="w-6 h-6 text-accent mt-1" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Latihan Rutin</h4>
                <p className="text-foreground/70">Dilakukan 2x seminggu pada Kamis dan Jumat jam 19.30</p>
              </div>
            </li>
            <li className="flex gap-4 hover:bg-secondary/50 p-3 rounded-lg transition-all duration-300">
              <div className="flex-shrink-0">
                <Hands className="w-6 h-6 text-primary mt-1" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">Doa Bersama</h4>
                <p className="text-foreground/70">Momen berkumpul untuk berdoa dan berbagi berkat Tuhan</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
