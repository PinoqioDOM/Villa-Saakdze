import { Cormorant_Garamond, Jost } from "next/font/google";
import ScrollVideoHero from "@/components/ScrollVideoHero";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

const rooms = [
  {
    name: "The Vine Room",
    note: "Garden level · sleeps 2",
    blurb: "Low beams, linen, and the smell of the old vineyard after rain.",
  },
  {
    name: "The Stone Suite",
    note: "First floor · sleeps 3",
    blurb: "Original masonry walls and a deep window seat over the courtyard.",
  },
  {
    name: "The Garden Loft",
    note: "Top floor · sleeps 2",
    blurb: "Under the rafters, with a small balcony facing the Caucasus.",
  },
];

export default function Home() {
  return (
    <main
      className={`${display.variable} ${body.variable} bg-[#1e1813] text-[#ece3d2] [font-family:var(--font-body),sans-serif]`}
    >
      <ScrollVideoHero src="/videos/villa-saakadze.mp4" trackLengthVh={400} />

      {/* About */}
      <section id="about" className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#b39a6b]">
          The Estate
        </p>
        <h2 className="mt-5 text-4xl font-medium italic [font-family:var(--font-display),Georgia,serif] md:text-5xl">
          Behind the old cellar doors
        </h2>
        <p className="mt-6 text-base font-light leading-relaxed text-[#cfc3ae]">
          A family villa in the Kakhetian countryside — stone walls, walnut
          shutters, and a garden that has been feeding the same table for four
          generations. Six guests, no more.
        </p>
      </section>

      {/* Rooms */}
      <section id="rooms" className="bg-[#241d15] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs uppercase tracking-[0.4em] text-[#b39a6b]">
            Rooms
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {rooms.map((room) => (
              <article key={room.name}>
                {/* Replace with real photography */}
                <div className="flex aspect-[4/5] items-center justify-center rounded-sm bg-[repeating-linear-gradient(45deg,#2b2319_0px,#2b2319_10px,#261f16_10px,#261f16_20px)]">
                  <span className="font-mono text-[11px] text-[#8b7c63]">
                    room photo
                  </span>
                </div>
                <h3 className="mt-5 text-2xl italic [font-family:var(--font-display),Georgia,serif]">
                  {room.name}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#b39a6b]">
                  {room.note}
                </p>
                <p className="mt-3 text-sm font-light leading-relaxed text-[#cfc3ae]">
                  {room.blurb}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-[#b39a6b]">
          Contact
        </p>
        <h2 className="mt-5 text-4xl font-medium italic [font-family:var(--font-display),Georgia,serif]">
          Come stay a while
        </h2>
        <p className="mt-6 text-base font-light leading-relaxed text-[#cfc3ae]">
          Sighnaghi district, Kakheti, Georgia
        </p>
        <a
          href="mailto:stay@villasaakadze.ge"
          className="mt-2 inline-block text-base text-[#c9ab77] underline-offset-4 transition-colors hover:text-[#e0cfa8] hover:underline"
        >
          stay@villasaakadze.ge
        </a>
      </section>

      <footer className="border-t border-[#ece3d2]/10 py-10 text-center text-xs tracking-[0.2em] text-[#8b7c63]">
        VILLA SAAKADZE · EST. 1923
      </footer>
    </main>
  );
}
