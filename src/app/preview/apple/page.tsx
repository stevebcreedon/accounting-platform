"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import Link from "next/link";

// ─── Data ───────────────────────────────────────────────────────────
const ARTICLES = [
  { title: "How to Register for VAT in Ireland", cat: "Tax", time: 18, pillar: true, desc: "Everything Irish business owners need to know about VAT registration, thresholds, and filing with Revenue." },
  { title: "Sole Trader vs Limited Company", cat: "Structure", time: 17, pillar: true, desc: "The definitive comparison for Irish entrepreneurs choosing their business structure." },
  { title: "What Does an Accountant Cost?", cat: "Costs", time: 15, pillar: true, desc: "Transparent breakdown of accountancy fees across Ireland — from sole traders to limited companies." },
  { title: "Starting a Business in Ireland", cat: "Getting Started", time: 19, pillar: true, desc: "Your complete roadmap from idea to registered business — CRO, Revenue, bank accounts, and more." },
  { title: "Bookkeeping Essentials", cat: "Basics", time: 16, pillar: false, desc: "The records every Irish business must keep, and the simplest way to stay compliant." },
  { title: "Irish Tax Deadlines 2025", cat: "Compliance", time: 14, pillar: false, desc: "Never miss a filing date — every Revenue deadline mapped out for the Irish tax year." },
];

const TOPICS = [
  "Getting Started", "Business Structures", "Tax Obligations", "Accounting Basics",
  "Choosing an Accountant", "Costs & Fees", "Compliance", "Industry Guides",
];

// ─── Reveal ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1], delay }}>
      {children}
    </motion.div>
  );
}

// ─── Number ticker ──────────────────────────────────────────────────
function Ticker({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const num = parseInt(value) || 0;
  const [count, setCount] = useState(0);
  const suffix = value.replace(/[0-9]/g, "");
  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 4)) * num));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, num]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-7xl font-heading font-bold tracking-tight bg-gradient-to-br from-burnt-orange-500 to-burnt-orange-600 bg-clip-text text-transparent">
        {count}{suffix}
      </div>
      <div className="text-sm text-burnt-orange-400 mt-3 tracking-wide uppercase font-medium">{label}</div>
    </div>
  );
}

// ─── Article card ───────────────────────────────────────────────────
function Card({ article, index }: { article: typeof ARTICLES[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1], delay: index * 0.1 }}>
      <Link href="#" className="group block h-full">
        <div className="relative overflow-hidden rounded-2xl bg-white border border-burnt-orange-100/60 p-8 h-full transition-all duration-500 group-hover:border-burnt-orange-300 group-hover:shadow-[0_12px_48px_-12px_rgba(232,114,12,0.18)] group-hover:-translate-y-1">
          {/* Top accent — always visible, strengthens on hover */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-burnt-orange-400 via-burnt-orange-500 to-burnt-orange-400 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Orange glow on hover */}
          <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-burnt-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-bold tracking-widest uppercase text-burnt-orange-500 bg-burnt-orange-50 rounded-full px-3 py-1">
                {article.cat}
              </span>
              {article.pillar && (
                <span className="text-[10px] font-bold tracking-wider uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1">
                  Guide
                </span>
              )}
            </div>

            <h3 className="font-heading text-xl font-semibold text-charcoal leading-snug mb-3 group-hover:text-burnt-orange-600 transition-colors duration-300">
              {article.title}
            </h3>

            <p className="text-[15px] text-stone-500 leading-relaxed line-clamp-2 mb-6">
              {article.desc}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-burnt-orange-300 font-medium">{article.time} min read</span>
              <span className="flex items-center gap-1 text-burnt-orange-500 text-sm font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                Read <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────
export default function ApplePreview() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [email, setEmail] = useState("");

  return (
    <div className="bg-white text-charcoal antialiased overflow-hidden">

      {/* ─── Nav ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 z-50 w-full">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between h-16 border-b border-burnt-orange-100/30" style={{ backdropFilter: "saturate(180%) blur(20px)", WebkitBackdropFilter: "saturate(180%) blur(20px)", backgroundColor: "rgba(255,255,255,0.72)" }}>
            <span className="font-heading text-xl font-bold tracking-tight">
              The <span className="text-burnt-orange-500">Ledger</span>
            </span>
            <div className="hidden md:flex items-center gap-8">
              {["Guides", "Topics", "About"].map((item) => (
                <Link key={item} href="#" className="text-[13px] text-stone-500 hover:text-burnt-orange-500 transition-colors duration-200">
                  {item}
                </Link>
              ))}
              <Link href="#" className="text-[13px] font-semibold text-white bg-burnt-orange-500 rounded-full px-5 py-2 hover:bg-burnt-orange-600 hover:shadow-md hover:shadow-burnt-orange-500/20 transition-all duration-200">
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <motion.section
        ref={heroRef}
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative min-h-[100svh] flex flex-col items-center justify-center px-6 pt-16"
      >
        {/* Big warm radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 90% 70% at 50% 35%, rgba(232,114,12,0.10), transparent 70%), radial-gradient(ellipse 60% 50% at 75% 65%, rgba(232,114,12,0.06), transparent 60%), radial-gradient(ellipse 40% 30% at 20% 70%, rgba(232,114,12,0.04), transparent)" }} />

        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #E8720C 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0, 1] }}
            className="inline-flex items-center gap-2 bg-burnt-orange-500 rounded-full px-5 py-2 mb-10 shadow-lg shadow-burnt-orange-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[12px] font-semibold text-white tracking-wide">72 expert guides for Irish business</span>
          </motion.div>

          <h1 className="font-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-charcoal">
            {["Accounting", "guidance", "that", "actually", "makes"].map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-[0.3em]"
                initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1], delay: i * 0.08 }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              className="inline-block bg-gradient-to-r from-burnt-orange-500 to-burnt-orange-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1], delay: 5 * 0.08 }}
            >
              sense.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0, 1] }}
            className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto mt-8 leading-relaxed"
          >
            Clear, jargon-free answers to every question Irish sole traders,
            company directors, and founders ask about tax, compliance, and costs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
          >
            <Link href="#guides" className="group flex items-center gap-2 bg-burnt-orange-500 text-white font-semibold text-[15px] rounded-full px-9 py-4 hover:bg-burnt-orange-600 hover:shadow-xl hover:shadow-burnt-orange-500/25 hover:-translate-y-0.5 transition-all duration-300">
              Browse guides
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link href="#subscribe" className="text-[15px] font-semibold text-burnt-orange-500 hover:text-burnt-orange-600 transition-colors duration-200 flex items-center gap-1">
              Get updates <span className="group-hover:translate-x-0.5">→</span>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="w-6 h-9 rounded-full border-2 border-burnt-orange-400 flex items-start justify-center pt-2">
            <div className="w-1.5 h-2 rounded-full bg-burnt-orange-500" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ─── Stats ───────────────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #FFF7ED 0%, #FFF1E0 25%, #FFFFFF 50%, #FFF1E0 75%, #FFF7ED 100%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 15% 50%, rgba(232,114,12,0.10), transparent 40%), radial-gradient(circle at 85% 50%, rgba(232,114,12,0.10), transparent 40%)" }} />
        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-burnt-orange-500/20 to-transparent" />
        <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-transparent via-burnt-orange-500/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Reveal>
            <div className="grid grid-cols-3 gap-8 md:gap-16">
              <Ticker value="72" label="Expert Guides" />
              <Ticker value="8" label="Categories" />
              <Ticker value="100%" label="Free" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── Latest Guides ───────────────────────────────────── */}
      <section id="guides" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="flex items-end justify-between mb-16">
              <div>
                <span className="text-[12px] font-bold tracking-widest uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1 inline-block mb-4">Latest</span>
                <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">Expert guides</h2>
                <div className="w-16 h-1.5 bg-gradient-to-r from-burnt-orange-500 to-burnt-orange-300 rounded-full mt-5" />
              </div>
              <Link href="#" className="hidden md:flex items-center gap-2 text-sm font-semibold text-burnt-orange-500 hover:text-burnt-orange-600 transition-colors bg-burnt-orange-50 rounded-full px-5 py-2.5 hover:bg-burnt-orange-100">
                View all →
              </Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTICLES.map((article, i) => (
              <Card key={i} article={article} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Divider ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="h-[2px] rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(232,114,12,0.3), rgba(232,114,12,0.5), rgba(232,114,12,0.3), transparent)" }} />
      </div>

      {/* ─── Topics ──────────────────────────────────────────── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(232,114,12,0.04) 0%, rgba(232,114,12,0.08) 50%, rgba(232,114,12,0.04) 100%)" }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[12px] font-bold tracking-widest uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1 inline-block mb-4">Browse</span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight">By topic</h2>
              <div className="w-16 h-1.5 bg-gradient-to-r from-burnt-orange-300 via-burnt-orange-500 to-burnt-orange-300 rounded-full mt-5 mx-auto" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {TOPICS.map((topic) => (
                <motion.div key={topic} whileHover={{ y: -3, scale: 1.03 }} transition={{ duration: 0.2 }}>
                  <Link
                    href="#"
                    className="inline-block rounded-full border-2 border-burnt-orange-200 bg-white px-6 py-3 text-[14px] font-semibold text-stone-600 hover:bg-burnt-orange-500 hover:text-white hover:border-burnt-orange-500 hover:shadow-lg hover:shadow-burnt-orange-500/20 transition-all duration-300"
                  >
                    {topic}
                  </Link>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────────── */}
      <section id="subscribe" className="py-32 px-6 relative overflow-hidden">
        {/* Orange ambient glow behind the form */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(232,114,12,0.06), transparent)" }} />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <Reveal>
            <span className="text-[12px] font-bold tracking-widest uppercase text-white bg-burnt-orange-500 rounded-full px-3 py-1 inline-block mb-4">Stay informed</span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-2">
              Never miss an update.
            </h2>
            <div className="w-16 h-1.5 bg-gradient-to-r from-burnt-orange-300 via-burnt-orange-500 to-burnt-orange-300 rounded-full mx-auto mb-8" />
            <p className="text-stone-400 text-lg mb-12 leading-relaxed">
              Get new Irish accounting guides delivered to your inbox.
              No spam — just clear, useful guidance.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ie"
                className="flex-1 rounded-full border-2 border-burnt-orange-200 bg-white px-6 py-3.5 text-[15px] text-charcoal placeholder:text-stone-300 outline-none focus:border-burnt-orange-500 focus:ring-4 focus:ring-burnt-orange-500/10 transition-all duration-200"
              />
              <button className="rounded-full bg-burnt-orange-500 text-white font-semibold text-[15px] px-8 py-3.5 hover:bg-burnt-orange-600 hover:shadow-xl hover:shadow-burnt-orange-500/25 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-[12px] text-stone-300 mt-5">
              Free forever. Unsubscribe anytime. We respect your privacy.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className="py-16 px-6 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(232,114,12,0.3), rgba(232,114,12,0.5), rgba(232,114,12,0.3), transparent)" }} />
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-12">
            <div>
              <span className="font-heading text-lg font-bold">The <span className="text-burnt-orange-500">Ledger</span></span>
              <p className="text-sm text-stone-400 mt-2 max-w-xs leading-relaxed">
                Clear accounting guidance for Irish business owners.
                Educational content — not professional advice.
              </p>
              <div className="flex gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-burnt-orange-50 flex items-center justify-center hover:bg-burnt-orange-100 transition-colors cursor-pointer">
                  <span className="text-burnt-orange-500 text-xs font-bold">X</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-burnt-orange-50 flex items-center justify-center hover:bg-burnt-orange-100 transition-colors cursor-pointer">
                  <span className="text-burnt-orange-500 text-xs font-bold">in</span>
                </div>
              </div>
            </div>
            <div className="flex gap-16">
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-burnt-orange-400 block mb-4">Platform</span>
                {["Guides", "Topics", "About"].map((l) => (
                  <Link key={l} href="#" className="block text-sm text-stone-500 hover:text-burnt-orange-500 transition-colors py-1.5">{l}</Link>
                ))}
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-widest uppercase text-burnt-orange-400 block mb-4">Legal</span>
                {["Privacy", "Terms", "Contact"].map((l) => (
                  <Link key={l} href="#" className="block text-sm text-stone-500 hover:text-burnt-orange-500 transition-colors py-1.5">{l}</Link>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-burnt-orange-100/50 flex items-center justify-between text-[12px] text-stone-300">
            <span>© 2025 The Ledger. All content is for educational purposes only.</span>
            <span className="hidden md:block text-burnt-orange-300">Made in Ireland 🇮🇪</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
