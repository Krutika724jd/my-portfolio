  import { useState, useEffect, useRef } from "react";
  import SkillBar from "./Components/SkillBar";
  import SectionLabel from "./Components/SectionLabel";
  import { ME,TICKER,NAV } from "./Data/data";

/* ─── GLOBAL CSS (only for things Tailwind cannot express) ─────────── */
const GLOBAL_CSS = `
  html { scroll-behavior: smooth; }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #07070f; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#8b5cf6, #06b6d4); border-radius: 99px; }

  /* Fonts */
  .font-syne  { font-family: 'Syne', sans-serif; }
  .font-mono2 { font-family: 'Space Mono', monospace; }
  .font-dm    { font-family: 'DM Sans', sans-serif; }

  /* Gradient text helpers */
  .grad-text {
    background: linear-gradient(135deg, #e2e0f0 30%, #8b5cf6 60%, #06b6d4 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .grad-text-vp {
    background: linear-gradient(135deg, #8b5cf6, #06b6d4);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .grad-text-hero {
    background: linear-gradient(135deg, #ffffff 0%, #e2e0f0 40%, #c4b5fd 70%, #8b5cf6 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* Grid background */
  .grid-bg {
    background-image:
      linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* Section divider */
  .section-divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.2), transparent);
  }

  /* Nav underline */
  .nav-item { position: relative; padding-bottom: 4px; }
  .nav-item::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 1px;
    background: linear-gradient(90deg, #8b5cf6, #06b6d4);
    transition: width 0.25s;
  }
  .nav-item:hover::after, .nav-item.active::after { width: 100%; }
  .nav-item:hover, .nav-item.active { color: #e2e0f0 !important; }

  /* Ticker */
  .ticker-track { animation: tickerMove 22s linear infinite; }
  @keyframes tickerMove { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  /* Hero slide-up */
  .hero-line { overflow: hidden; }
  .slide-up { animation: slideUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes slideUp { from { transform: translateY(110%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* Fade in up */
  .fade-in-up { opacity: 0; transform: translateY(28px); animation: fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
  @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

  /* Pulse dot */
  .pulse-dot { animation: pulseDot 2s infinite; }
  @keyframes pulseDot { 0%,100%{opacity:1} 50%{opacity:0.35} }

  /* Skill bar fill transition */
  .skill-fill { transition: width 1.2s cubic-bezier(0.16,1,0.3,1); }

  /* Cursor left/top transition (JS sets these, CSS transitions them) */
  .cursor-glow { transition: left 0.12s ease, top 0.12s ease; }

  /* Project banner shimmer */
  .bento-banner {
    height: 6px;
    background: linear-gradient(90deg, #8b5cf6, #06b6d4, #8b5cf6);
    background-size: 200% 100%;
    animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer { to { background-position: 200% 0; } }

  /* Edu card left accent */
  .edu-card { position: relative; overflow: hidden; }
  .edu-card::before {
    content: ''; position: absolute; top: 0; left: 0;
    width: 3px; height: 100%;
    background: linear-gradient(180deg, #8b5cf6, #06b6d4);
  }

  /* CTA primary shimmer overlay */
  .cta-primary-btn { position: relative; overflow: hidden; }
  .cta-primary-btn::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, #06b6d4, #8b5cf6);
    opacity: 0; transition: opacity 0.3s;
  }
  .cta-primary-btn:hover::before { opacity: 1; }
  .cta-primary-btn:hover { box-shadow: 0 8px 32px rgba(139,92,246,0.5) !important; transform: translateY(-2px); }

  /* Scroll bar height line */
  .scroll-bar { background: linear-gradient(180deg, transparent, #8b5cf6); }

  /* Section number gradient bar */
  .num-bar { background: linear-gradient(90deg, #8b5cf6, transparent); }

  /* Exp top accent */
  .exp-top-bar { background: linear-gradient(90deg, #8b5cf6, #06b6d4); }

  @media (max-width: 768px) {
    .desktop-nav { display: none !important; }
    .about-grid  { grid-template-columns: 1fr !important; }
    .skills-grid { grid-template-columns: 1fr !important; }
  }
  @media (min-width: 769px) {
    .mobile-nav-menu { display: none !important; }
    .hamburger-btn   { display: none !important; }
  }
`;

/* ─── CURSOR GLOW ──────────────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="cursor-glow fixed pointer-events-none z-[9999] w-[400px] h-[400px] rounded-full -translate-x-1/2 -translate-y-1/2"
      style={{
        background:
          "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
      }}
    />
  );
}

/* ─── GRID BACKGROUND ──────────────────────────────────────────────── */
function GridBg() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="grid-bg absolute inset-0" />
      {/* violet blob top-right */}
      <div
        className="absolute rounded-full blur-[40px]"
        style={{
          top: "-20%",
          right: "-10%",
          width: 700,
          height: 700,
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)",
        }}
      />
      {/* cyan blob bottom-left */}
      <div
        className="absolute rounded-full blur-[40px]"
        style={{
          bottom: "10%",
          left: "-15%",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 65%)",
        }}
      />
      {/* centre ellipse */}
      <div
        className="absolute rounded-full blur-[60px] -translate-x-1/2 -translate-y-1/2"
        style={{
          top: "50%",
          left: "50%",
          width: 800,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.04) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

/* ─── MAIN ─────────────────────────────────────────────────────────── */
export default function Portfolio() {
  const [activeNav, setActiveNav] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [typedRole, setTypedRole] = useState("");
  const roles = [
    "Frontend Developer",
    "React Specialist",
    "UI Engineer",
    "Component Architect",
  ];
  const roleIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  // Scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Typewriter
  useEffect(() => {
    let timer;
    const tick = () => {
      const cur = roles[roleIdx.current];
      if (!deleting.current) {
        charIdx.current++;
        setTypedRole(cur.slice(0, charIdx.current));
        if (charIdx.current === cur.length) {
          deleting.current = true;
          timer = setTimeout(tick, 1800);
          return;
        }
      } else {
        charIdx.current--;
        setTypedRole(cur.slice(0, charIdx.current));
        if (charIdx.current === 0) {
          deleting.current = false;
          roleIdx.current = (roleIdx.current + 1) % roles.length;
        }
      }
      timer = setTimeout(tick, deleting.current ? 40 : 80);
    };
    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setActiveNav(id);
    setMenuOpen(false);
  };

  const contactHref = (key) => {
    if (key === "email") return `mailto:${ME.contact.email}`;
    if (key === "phone") return `tel:${ME.contact.phone}`;
    if (key === "linkedin") return ME.contact.linkedin;
    return null;
  };
  const contactVal = (key) => ME.contact[key];

  return (
    <div className="font-dm bg-[#07070f] min-h-screen text-[#e2e0f0] overflow-x-hidden">
      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,300&family=Space+Mono:wght@400;700&family=Syne:wght@700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{GLOBAL_CSS}</style>

      <CursorGlow />
      <GridBg />

      {/* ════════════════════════════════ NAV ════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[500] transition-all duration-400 ${
          scrolled
            ? "bg-[rgba(7,7,15,0.85)] backdrop-blur-xl border-b border-violet-500/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1140px] mx-auto px-8 h-[68px] flex items-center justify-between">
          {/* Logo */}
          <div className="font-syne font-black text-[22px] tracking-tight">
            <span className="grad-text-vp">KJ</span>
            {/* <span className="text-violet-500">.</span> */}
          </div>

          {/* Desktop links */}
          <div className="desktop-nav flex gap-9">
            {NAV.map((n) => (
              <span
                key={n}
                onClick={() => scrollTo(n)}
                className={`nav-item font-mono2 text-[11px] font-bold tracking-[0.12em] uppercase cursor-pointer transition-colors duration-200 ${activeNav === n ? "active text-[#e2e0f0]" : "text-gray-100"}`}
              >
                {n}
              </span>
            ))}
          </div>

          {/* Hire Me */}
          <a
            href={`mailto:${ME.contact.email}`}
            className="cta-primary-btn desktop-nav font-mono2 text-[11px] font-bold tracking-[0.12em] uppercase px-[22px] py-[9px] rounded-lg text-white no-underline"
            style={{
              background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
              boxShadow: "0 4px 24px rgba(139,92,246,0.3)",
            }}
          >
            <span className="relative z-10">Hire Me ✦</span>
          </a>

          {/* Hamburger */}
          <button
            className="hamburger-btn bg-violet-500/10 border border-violet-500/25 text-violet-400 text-lg cursor-pointer px-3 py-2 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-nav-menu bg-[rgba(10,9,20,0.97)] backdrop-blur-xl border-t border-violet-500/10 px-8 py-5 flex flex-col gap-0">
            {NAV.map((n) => (
              <span
                key={n}
                onClick={() => scrollTo(n)}
                className={`nav-item font-mono2 text-[13px] font-bold tracking-[0.1em] uppercase cursor-pointer py-3.5 border-b border-violet-500/[0.06] transition-colors ${activeNav === n ? "text-[#e2e0f0]" : "text-gray-500"}`}
              >
                {n}
              </span>
            ))}
            <a
              href={`mailto:${ME.contact.email}`}
              className="cta-primary-btn mt-5 text-center font-mono2 text-[11px] font-bold tracking-[0.12em] uppercase px-8 py-3.5 rounded-lg text-white no-underline"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
                boxShadow: "0 4px 24px rgba(139,92,246,0.3)",
              }}
            >
              <span className="relative z-10">Hire Me ✦</span>
            </a>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════ HERO ═══════════════════════ */}
      <section
        id="Home"
        className="relative z-10 max-w-[1140px] mx-auto px-8 min-h-screen flex flex-col justify-center pt-20 pb-16"
      >
        {/* Status pill */}
        <div className="fade-in-up mb-10" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20">
            <div
              className="pulse-dot w-[7px] h-[7px] rounded-full bg-cyan-400"
              style={{ boxShadow: "0 0 8px #22d3ee" }}
            />
            <span className="font-mono2 text-[11px] text-cyan-400 tracking-[0.15em] uppercase font-bold">
              Available for Opportunities
            </span>
          </div>
        </div>

        {/* Giant name */}
        <div className="mb-6  max-w-full overflow-hidden">
          <div className="hero-line mb-1">
            <span
              className="slide-up font-syne font-black leading-[0.9] tracking-[-0.03em] grad-text-hero block text-[3.5rem] sm:text-[clamp(64px,12vw,130px)]"
              style={{
                // fontSize: "clamp(64px,12vw,130px)",
                animationDelay: "0.2s",
              }}
            >
              Krutika
            </span>
          </div>
          <div className="hero-line">
            <span
              className="slide-up font-syne font-black leading-[0.9] tracking-[-0.03em] grad-text-vp block text-[3.3rem] sm:text-[clamp(64px,12vw,130px)]"
              style={{
                // fontSize: "clamp(64px,12vw,130px)",
                animationDelay: "0.3s",
              }}
            >
              Jadhav
            </span>
          </div>
        </div>

        {/* Typewriter */}
        <div
          className="fade-in-up flex items-center gap-4 mb-8 flex-wrap"
          style={{ animationDelay: "0.55s" }}
        >
          <div
            className="w-12 h-0.5 rounded-full"
            style={{ background: "linear-gradient(90deg,#8b5cf6,#06b6d4)" }}
          />
          <span
            className="font-mono2 text-violet-400 font-bold tracking-[0.04em]"
            style={{ fontSize: "clamp(14px,2vw,18px)" }}
          >
            {typedRole}
            <span className="pulse-dot text-cyan-400">|</span>
          </span>
        </div>

        {/* Summary + stats */}
        <div
          className="fade-in-up flex gap-16 items-end flex-wrap"
          style={{ animationDelay: "0.7s" }}
        >
          <div className="max-w-[460px]">
            <p className="text-base text-gray-400 leading-[1.85] mb-8">
              {ME.summary}
            </p>
            <div className="flex gap-3.5 flex-wrap">
              <a
                href={ME.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="cta-primary-btn font-mono2 text-[13px] font-bold tracking-[0.08em] uppercase px-8 py-3.5 rounded-lg text-white no-underline"
                style={{
                  background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
                  boxShadow: "0 4px 24px rgba(139,92,246,0.3)",
                }}
              >
                <span className="relative z-10">View LinkedIn ↗</span>
              </a>
              <a
                href={`mailto:${ME.contact.email}`}
                className="font-mono2 text-[13px] font-bold tracking-[0.08em] uppercase px-8 py-3.5 rounded-lg text-[#e2e0f0] no-underline border border-violet-500/35 hover:border-violet-500 hover:bg-violet-500/[0.08] transition-all duration-300 hover:-translate-y-0.5"
              >
                Get In Touch
              </a>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {ME.stats.map(({ num, label }) => (
              <div
                key={label}
                className="rounded-2xl px-7 py-6 border border-violet-500/12 hover:border-violet-500/35 hover:shadow-[0_0_30px_rgba(139,92,246,0.08)] transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,92,246,0.06), rgba(6,182,212,0.04))",
                }}
              >
                <div className="font-syne text-[36px] font-black leading-none grad-text-vp">
                  {num}
                </div>
                <div className="text-[11px] text-gray-500 mt-1.5 tracking-[0.08em] uppercase font-semibold">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="fade-in-up flex items-center gap-3 mt-16"
          style={{ animationDelay: "1s" }}
        >
          <div className="scroll-bar pulse-dot w-px h-12 rounded-full" />
          <span className="font-mono2 text-[10px] text-gray-600 tracking-[0.2em] uppercase">
            Scroll to explore
          </span>
        </div>
      </section>

      {/* ══════════════════════════════ TICKER ═══════════════════════ */}
      <div className="relative z-10 bg-violet-500/[0.04] border-t border-b border-violet-500/10 py-3.5 overflow-hidden">
        <div className="ticker-track flex gap-0 w-max">
          {[...Array(2)].flatMap((_, idx) =>
            TICKER.map((s, i) => (
              <div key={`${idx}-${i}`} className="flex items-center gap-8 px-7">
                <span className="font-mono2 text-[11px] font-bold tracking-[0.15em] uppercase text-gray-700 whitespace-nowrap">
                  {s}
                </span>
                <span className="text-violet-500 text-[8px]">✦</span>
              </div>
            )),
          )}
        </div>
      </div>

      {/* ══════════════════════════ PAGE SECTIONS ════════════════════ */}
      <div className="relative z-10 max-w-[1140px] mx-auto px-8">
        {/* ─── ABOUT ─────────────────────────────────────────────── */}
        <section id="About" className="py-24">
          <SectionLabel num="01" text="About Me" />
          <div className="about-grid grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left copy */}
            <div className="overflow-hidden sm:overflow-none">
              <h2
                className="font-syne font-black leading-[1.05] tracking-[-0.02em] mb-7  text-[clamp(36px,5vw,60px)]"
                // style={{ fontSize: "clamp(36px,5vw,60px)" }}
              >
                <span className="text-[#e2e0f0]">Crafting</span>
                <br />
                <span className="grad-text">experiences</span>
                <br />
                <span className="text-[#e2e0f0]">that matter.</span>
              </h2>
              <p className="text-[15px] text-gray-400 leading-[1.9] mb-5">
                I'm a{" "}
                <strong className="text-[#e2e0f0] font-semibold">
                  Frontend Developer
                </strong>{" "}
                with real production experience — my code is live on India's{" "}
                <strong className="text-violet-300">
                  Prudential Health Insurance
                </strong>{" "}
                platform, used daily by brokers and agents across the country.
              </p>
              <p className="text-[15px] text-gray-400 leading-[1.9] mb-9">
                I specialise in building{" "}
                <strong className="text-cyan-400">
                  reusable component systems
                </strong>
                , schema-driven forms, and seamless API integrations. Every
                pixel and every interaction is intentional.
              </p>

              {/* Contact rows */}
              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: "✉",
                    label: "Email",
                    val: ME.contact.email,
                    href: `mailto:${ME.contact.email}`,
                  },
                  {
                    icon: "📍",
                    label: "Location",
                    val: ME.contact.location,
                    href: null,
                  },
                  {
                    icon: "☎",
                    label: "Phone",
                    val: ME.contact.phone,
                    href: `tel:${ME.contact.phone}`,
                  },
                ].map(({ icon, label, val, href }) => (
                  <div key={label} className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-sm flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="font-mono2 text-[10px] text-gray-500 tracking-[0.12em] uppercase">
                        {label}
                      </div>
                      {href ? (
                        <a
                          href={href}
                          className="font-mono2 text-[13px] text-violet-400 no-underline"
                        >
                          {val}
                        </a>
                      ) : (
                        <span className="font-mono2 text-[13px] text-gray-300">
                          {val}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right card */}
            <div
              className="rounded-2xl p-8 border border-violet-500/15 hover:border-violet-500/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.08)] transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #0f0e1a 0%, #111020 100%)",
              }}
            >
              <div className="font-mono2 text-[10px] text-violet-500 tracking-[0.15em] uppercase font-bold mb-5">
                // what I bring to the table
              </div>
              {ME.about.map(({ icon, title, desc }, i) => (
                <div
                  key={title}
                  className={`flex gap-4 mb-5 pb-5 ${i < ME.about.length - 1 ? "border-b border-violet-500/[0.07]" : ""}`}
                >
                  <div className="w-10 h-10 rounded-[10px] bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-lg flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#e2e0f0] mb-1">
                      {title}
                    </div>
                    <div className="text-[16px] text-gray-500 leading-relaxed">
                      {desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── EXPERIENCE ────────────────────────────────────────── */}
        <section id="Experience" className="py-24">
          <SectionLabel num="02" text="Experience" />
          <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
            <h2
              className="font-syne font-black leading-[1.05] tracking-[-0.02em]"
              style={{ fontSize: "clamp(36px,6vw,64px)" }}
            >
              <span className="grad-text">Work</span>
              <span className="text-[#e2e0f0]">.</span>
            </h2>
            <span className="font-mono2 text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-cyan-500/[0.08] border border-cyan-500/20 text-cyan-400">
              1 Position · Full Time
            </span>
          </div>

          {ME.experience.map((exp, i) => (
            <div
              key={i}
              className="relative rounded-2xl px-10 py-9 border border-violet-500/15 hover:border-violet-500/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.08)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f0e1a 0%, #111020 100%)",
              }}
            >
              {/* top accent bar */}
              <div className="exp-top-bar absolute top-0 left-0 w-full h-[3px]" />

              {/* Header */}
              <div className="flex justify-between flex-wrap gap-4 mb-7 pb-7 border-b border-violet-500/10">
                <div>
                  <div className="font-mono2 text-[16px] text-gray-100 tracking-[0.1em] mb-2.5">
                    {exp.duration}
                  </div>
                  <div className="font-syne text-[26px] font-extrabold text-[#e2e0f0] tracking-tight mb-1.5">
                    {exp.role}
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[15px] text-cyan-400 font-semibold">
                      {exp.company}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-700 inline-block" />
                    <span className="text-[15px] text-gray-100">
                      {exp.location}
                    </span>
                  </div>
                </div>
                <span className="font-mono2 text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-full bg-violet-500/[0.08] border border-violet-500/20 text-violet-400 self-start">
                  {exp.type}
                </span>
              </div>

              {/* Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {exp.points.map((p, j) => (
                  <div key={j} className="flex gap-3 items-start mb-3">
                    <div className="w-[22px] h-[22px] rounded-md flex-shrink-0 mt-0.5 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/25">
                      <div className="w-[5px] h-[5px] rounded-full bg-cyan-400" />
                    </div>
                    <p className="text-[16px] text-gray-400 leading-[1.75]">
                      {p}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        <div className="section-divider" />

        {/* ─── SKILLS ────────────────────────────────────────────── */}
        <section id="Skills" className="py-24">
          <SectionLabel num="03" text="Skills" />
          <h2
            className="font-syne font-black leading-[1.05] tracking-[-0.02em] mb-14"
            style={{ fontSize: "clamp(36px,6vw,64px)" }}
          >
            <span className="text-[#e2e0f0]">What</span>
            <br />
            <span className="grad-text">I use.</span>
          </h2>

          <div className="skills-grid grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Bars */}
            <div>
              <div className="font-mono2 text-[10px] text-violet-500 tracking-[0.2em] uppercase font-bold mb-6">
                // proficiency levels
              </div>
              {ME.skills.map(({ label, level, color }, i) => (
                <SkillBar
                  key={label}
                  label={label}
                  level={level}
                  color={color}
                  delay={i * 80}
                />
              ))}
            </div>

            {/* Tech cloud + categories */}
            <div>
              <div className="font-mono2 text-[15px] text-violet-500 tracking-[0.2em] uppercase font-bold mb-6">
                // full tech stack
              </div>
              <div className="leading-none mb-8">
                {ME.techCloud.map((t) => (
                  <span
                    key={t}
                    className="inline-block font-mono2 text-[16px] font-bold tracking-[0.08em] px-3.5 py-[5px] rounded-full bg-violet-500/[0.08] border border-violet-500/20 text-violet-400 m-[3px] hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-violet-200 hover:shadow-[0_0_12px_rgba(139,92,246,0.2)] transition-all duration-200"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {ME.skillCategories.map(({ label, items }) => (
                <div
                  key={label}
                  className="mb-4 px-[18px] py-3.5 rounded-xl bg-violet-500/[0.04] border border-violet-500/[0.08]"
                >
                  <div className="font-mono2 text-[15px] text-gray-500 tracking-[0.15em] uppercase font-bold mb-2">
                    {label}
                  </div>
                  <div>
                    {items.map((item) => (
                      <span
                        key={item}
                        className="inline-block font-mono2 text-[16px] font-bold tracking-[0.08em] px-3.5 py-[5px] rounded-full bg-violet-500/[0.08] border border-violet-500/20 text-violet-400 m-[3px] hover:bg-violet-500/20 hover:border-violet-500/50 hover:text-violet-200 transition-all duration-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── PROJECTS ──────────────────────────────────────────── */}
        <section id="Projects" className="py-24">
          <SectionLabel num="04" text="Projects" />
          <h2
            className="font-syne font-black leading-[1.05] tracking-[-0.02em] mb-14"
            style={{ fontSize: "clamp(36px,6vw,64px)" }}
          >
            <span className="text-[#e2e0f0]">Selected</span>
            <br />
            <span className="grad-text">Work.</span>
          </h2>

          {ME.projects.map((proj, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border border-violet-500/12 hover:border-violet-500/40 hover:shadow-[0_20px_60px_rgba(139,92,246,0.1)] hover:-translate-y-1.5 transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #0f0e1a, #111020)",
              }}
            >
              <div className="bento-banner" />
              <div className="px-10 py-9">
                {/* Header */}
                <div className="flex justify-between flex-wrap gap-5 mb-7">
                  <div>
                    <div className="font-mono2 text-[10px] text-gray-500 tracking-[0.12em] uppercase mb-2.5">
                      {proj.year}
                    </div>
                    <div className="font-syne text-[28px] font-extrabold text-[#e2e0f0] tracking-tight mb-2.5">
                      {proj.name}
                    </div>
                    <p className="text-sm text-gray-200 leading-[1.7] max-w-[500px]">
                      {proj.desc}
                    </p>
                     <a
                      href="https://productos-dashboard.netlify.app/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-6 px-6 py-3 rounded-full border border-violet-400 text-violet-400 font-medium tracking-wide transition-all duration-300 hover:bg-violet-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-1"
                      >
                      View Project →
</a>
                  </div>
                  <div className="flex flex-wrap gap-1.5 content-start max-w-[200px]">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="border font-mono2 text-[18px] font-bold tracking-[0.08em] px-3.5 py-[5px] rounded-full bg-violet-500/[0.08] border border-violet-500/20 text-violet-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-violet-500/10 mb-6" />

                {/* Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {proj.points.map((p, j) => (
                    <div
                      key={j}
                      className="flex gap-3 items-start px-4 py-3 rounded-xl bg-violet-500/[0.04] border border-violet-500/[0.07]"
                    >
                      <span className="font-mono2 text-[11px] text-violet-500 font-bold flex-shrink-0 mt-0.5">
                        0{j + 1}
                      </span>
                      <p className="text-[16px] text-gray-400 leading-[1.65]">
                        {p}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="section-divider" />

        {/* ─── EDUCATION ─────────────────────────────────────────── */}
        <section className="py-24">
          <SectionLabel num="05" text="Education" />
          <div className="overflow-hidden">

          <h2
            className="font-syne font-black leading-[1.05] tracking-[-0.02em] mb-14 text-[clamp(36px,6vw,64px)]"
            // style={{ fontSize: "clamp(36px,6vw,64px)" }}
          >
            <span className="grad-text">Academic</span>
            <br />
            <span className="text-[#e2e0f0]">Background.</span>
          </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ME.education.map((edu, i) => (
              <div
                key={i}
                className="edu-card rounded-2xl px-8 py-7 border border-violet-500/10 hover:border-violet-500/30 hover:translate-x-1 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #0f0e1a, #0d0c18)",
                }}
              >
                <div className="font-mono2 text-[10px] text-gray-500 tracking-[0.15em] uppercase mb-3.5">
                  {edu.duration}
                </div>
                <div className="font-syne text-xl font-extrabold text-[#e2e0f0] tracking-tight mb-1.5">
                  {edu.degree}
                </div>
                <div className="text-[13px] text-gray-400 mb-1">
                  {edu.college}
                </div>
                <div className="font-mono2 text-[15px] text-gray-100 mb-4">
                  {edu.university}
                </div>
                {edu.grade && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/[0.08] border border-green-500/20 text-green-400 font-mono2 text-[12px] font-bold">
                    <span>✓</span> {edu.grade}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="section-divider" />

        {/* ─── CONTACT ───────────────────────────────────────────── */}
        <section id="Contact" className="py-24 pb-32">
          <SectionLabel num="06" text="Contact" />

          <div className="text-center mb-16">
            <h2
              className="font-syne font-black leading-none tracking-[-0.03em] mb-5 text-[clamp(48px,8vw,96px)]"
              // style={{ fontSize: "clamp(48px,8vw,96px)" }}
            >
              <span className="text-[#e2e0f0] block">Let's build</span>
              <span className="grad-text-vp block">together.</span>
            </h2>
            <p className="text-base text-gray-500 max-w-[420px] mx-auto mb-10">
              Open to frontend roles, collaborations, and exciting product
              teams.
            </p>
            <a
              href={`mailto:${ME.contact.email}`}
              className="cta-primary-btn inline-block font-mono2 text-sm font-bold tracking-[0.08em] uppercase px-10 py-4 rounded-lg text-white no-underline"
              style={{
                background: "linear-gradient(135deg,#8b5cf6,#06b6d4)",
                boxShadow: "0 4px 24px rgba(139,92,246,0.3)",
              }}
            >
              <span className="relative z-10">Say Hello ✦</span>
            </a>
          </div>

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {ME.contactItems.map(({ icon, label, key }) => {
              const href = contactHref(key);
              const val = contactVal(key);
              const inner = (
                <>
                  <div className="w-11 h-11 rounded-xl bg-violet-500/12 border border-violet-500/20 flex items-center justify-center text-lg flex-shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="font-mono2 text-[16px] text-gray-500 tracking-[0.12em] uppercase font-bold mb-1">
                      {label}
                    </div>
                    <div className="font-mono2 text-[18px] text-violet-300 break-all">
                      {val}
                    </div>
                  </div>
                </>
              );
              const base =
                "flex items-center gap-3.5 px-6 py-5 rounded-xl border border-violet-500/12 bg-[#0f0e1a] no-underline hover:border-violet-500/45 hover:shadow-[0_0_32px_rgba(139,92,246,0.1)] hover:-translate-y-0.5 transition-all duration-250";
              return href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className={base}
                >
                  {inner}
                </a>
              ) : (
                <div key={label} className={`${base} cursor-default`}>
                  {inner}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ════════════════════════════════ FOOTER ═════════════════════ */}
      <div className="border-t border-violet-500/10 bg-[rgba(7,7,15,0.8)]">
        <div className="max-w-[1140px] mx-auto px-8 py-6 flex justify-between flex-wrap gap-2 items-center">
          <div className="font-syne font-black text-base">
            <span className="grad-text-vp">KJ</span>
            {/* <span className="text-violet-500">.</span> */}
          </div>
          <span className="font-mono2 text-[11px] text-gray-700 tracking-[0.08em]">
            © 2025 KRUTIKA JADHAV · FRONTEND DEVELOPER
          </span>
          <a
            href={ME.contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-mono2 text-[11px] text-violet-500 no-underline tracking-[0.08em] hover:text-violet-300 transition-colors"
          >
            LINKEDIN ↗
          </a>
        </div>
      </div>
    </div>
  );
}
