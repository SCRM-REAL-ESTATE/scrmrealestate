"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AGENT_CONTENT } from "@/lib/pricing";

/**
 * Two halves of one offer: agents on the blue side, agencies on the white.
 * They slide in from opposite edges and meet in the middle as the section
 * comes into view.
 */
export default function AgentsVsAgencies() {
  const reduce = useReducedMotion() ?? false;

  const slide = (from: "left" | "right") => ({
    hidden: reduce ? { opacity: 0 } : { opacity: 0, x: from === "left" ? -80 : 80 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
    },
  });

  const sides = [
    {
      key: "agents",
      from: "left" as const,
      title: "For agents",
      price: AGENT_CONTENT.price,
      priceSub: "per month",
      body: "Four videos a month that put you on camera, not the property. You turn up for an hour, we do the rest.",
      href: "/services#agent",
      cta: "See agent content",
      dark: true,
    },
    {
      key: "agencies",
      from: "right" as const,
      title: "For agencies",
      price: "$1,800",
      priceSub: "from, per month",
      body: "Your whole social presence run for you. 8 videos, 6 posts and 6 stories every month, planned and scheduled.",
      href: "/agencies",
      cta: "See agency management",
      dark: false,
    },
  ];

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-[1440px] px-3 md:px-6">
        {/* The blue half runs wider so the section reads as blue-led. */}
        <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr] gap-4 md:gap-0 overflow-hidden md:rounded-[3rem]">
          {sides.map((s) => (
            <motion.div
              key={s.key}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={slide(s.from)}
              className={`group relative flex flex-col justify-between p-10 md:p-16 lg:p-20 min-h-[420px] md:min-h-[560px] rounded-[2rem] md:rounded-none transition-colors duration-500 ${
                s.dark ? "blue-fade text-white" : "bg-re-blue-light border border-re-stone-light md:border-0"
              }`}
            >
              <div>
                <span aria-hidden className="gold-chrome-bg mb-5 block h-[3px] w-12 rounded-full" />

                <h3
                  className={`h-display text-4xl md:text-6xl ${s.dark ? "text-white" : "text-re-ink"}`}
                >
                  {s.title}
                </h3>

                <p className={`mt-6 font-serif text-5xl md:text-6xl ${s.dark ? "text-white" : "text-re-blue"}`}>
                  {s.price}
                  <span
                    className={`ml-2 text-xs font-sans tracking-wide uppercase ${
                      s.dark ? "text-white/80" : "text-re-stone"
                    }`}
                  >
                    {s.priceSub}
                  </span>
                </p>

                <p
                  className={`mt-6 text-lg leading-relaxed max-w-md ${
                    s.dark ? "text-white/85" : "text-re-stone"
                  }`}
                >
                  {s.body}
                </p>
              </div>

              <Link
                href={s.href}
                className={`mt-10 inline-flex items-center gap-2 self-start rounded-full px-7 py-3.5 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                  s.dark
                    ? "bg-white text-re-blue hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
                    : "bg-re-blue text-white hover:bg-re-blue-accent hover:shadow-[0_10px_30px_rgba(30,98,224,0.35)]"
                }`}
              >
                {s.cta}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
