import Navbar from "@/components/navbar"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 px-4 sm:py-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -left-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            PP GKPI PAMEN
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-foreground/80 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Perkumpulan Pemuda-Pemuda Gereja GKPI Pamen
          </p>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-8 text-foreground/60 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            Bersama melayani dan beribadah kepada Tuhan dengan penuh dedikasi dan kebersamaan
          </p>
          <Link
            href="/about"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">Kegiatan Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Pendalaman Alkitab",
                desc: "Setiap Jumat jam 19.30 kami melakukan pendalaman alkitab bersama-sama",
                icon: "📚",
              },
              {
                title: "Latihan Rutin",
                desc: "Latihan dilakukan 2x seminggu pada hari Kamis dan Jumat jam 19.30",
                icon: "🎯",
              },
              {
                title: "Komunitas",
                desc: "Bergabunglah dengan pemuda-pemuda gereja dalam komunitas kami yang solid",
                icon: "🤝",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in group cursor-pointer"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center text-foreground">{item.title}</h3>
                <p className="text-center text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-secondary/40 py-16 px-4 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 animate-fade-in">Jelajahi Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { href: "/about", title: "Tentang Kami", desc: "Pelajari tentang PP GKPI PAMEN" },
              { href: "/schedule", title: "Jadwal", desc: "Lihat jadwal acara kami" },
              { href: "/gallery", title: "Galeri", desc: "Lihat momen-momen kami" },
              { href: "/chat", title: "Chat", desc: "Bergabung dalam diskusi" },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="p-6 bg-card rounded-lg border border-border hover:border-primary hover:shadow-lg transition-all duration-300 hover:scale-105 text-center animate-fade-in group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{link.title}</h3>
                <p className="text-foreground/60 text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lokasi Kami */}
      <section className="py-16 px-4 md:py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">Lokasi Kami</h2>
          <div className="rounded-lg overflow-hidden border border-border shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.5789!2d98.6612!3d3.19592!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30312d3b0f0f0f0f%3A0x0!2sJl.%20Jamin%20Ginting%20No.352%2C%20Padang%20Bulan%2C%20Kec.%20Medan%20Baru%2C%20Kota%20Medan%2C%20Sumatera%20Utara!5e0!3m2!1sid!2sid!4v1700000000000"
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          </div>
          <div className="mt-8 text-center">
            <a
              href="https://maps.app.goo.gl/iXTY4SDFtfo9uAzC8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Buka di Google Maps
            </a>
            <p className="mt-4 text-foreground/60 text-sm">
              Jl. Jamin Ginting No.352, Padang Bulan, Kec. Medan Baru, Kota Medan, Sumatera Utara 20157
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 border-t border-border py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-foreground/60">
          <p>&copy; 2025 PP GKPI PAMEN. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
