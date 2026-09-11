/*
  Design philosophy: cinematic editorial web design.
  The page pairs a mineral-blue 3D stage with acid-pear markers, precise grid lines,
  serif editorial statements, and quiet camera-like interactions.
*/
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import CanvasScrubScene from "@/components/CanvasScrubScene";
import { denseFrames } from "@/lib/denseFrames";

const pearMark = "/manus-storage/favicon_46d88f43.svg";
const sceneFilms = {
  hero: { kind: "video", src: "/manus-storage/signal_a8dc18f8.mp4", poster: "/manus-storage/signal-poster_786ef30f.jpg" },
  model: { kind: "video", src: "/manus-storage/colossus_8def21b6.mp4", poster: "/manus-storage/colossus-poster_9463a752.jpg" },
  fit: { kind: "image", src: "/manus-storage/tree-001_4fdcc133.webp", poster: "/manus-storage/tree-121_853d9e6b.webp" },
  work: { kind: "image", src: "/manus-storage/flysky-060_2b93123e.webp", poster: "/manus-storage/flysky-001_608f4f85.webp" },
  terms: { kind: "image", src: "/manus-storage/trans-060_79005bb7.webp", poster: "/manus-storage/trans-001_3722cf7e.webp" },
  questions: { kind: "image", src: "/manus-storage/plan-001_35e013b1.webp", poster: "/manus-storage/plan-001_35e013b1.webp" },
  application: { kind: "image", src: "/manus-storage/coda-001_d1e3afed.webp", poster: "/manus-storage/coda-001_d1e3afed.webp" },
} as const;
type SceneKey = keyof typeof sceneFilms;
type DenseKey = keyof typeof denseFrames;
const denseForScene: Partial<Record<SceneKey, DenseKey>> = { model: "renaissance", fit: "tree", work: "flysky", terms: "trans", questions: "plan", application: "coda" };

function StableVideo({ src, poster, className, style }: { src: string; poster: string; className: string; style?: CSSProperties }) {
  const [ready, setReady] = useState(false);
  return (
    <div className={`${className} scene-video-shell`} style={style}>
      <img className="scene-video-poster" src={poster} alt="" aria-hidden="true" />
      <video
        className="scene-video"
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0 }}
      />
    </div>
  );
}

function SceneLayer({ scene, frameIndex, className, style }: { scene: SceneKey; frameIndex: number; className: string; style?: CSSProperties }) {
  const media = sceneFilms[scene];
  const denseKey = denseForScene[scene];
  if (denseKey) {
    return <CanvasScrubScene frames={denseFrames[denseKey]} frameIndex={frameIndex} className={`${className} scene-scrub-canvas`} style={style} />;
  }
  return <StableVideo src={media.src} poster={media.poster} className={className} style={style} />;
}

const faqs = [
  {
    question: "What does it cost to work with Pear?",
    answer:
      "Nothing upfront and nothing hourly. We fund the strategy, software, content and link building ourselves. Our payment is an agreed percentage of the new revenue that work generates. If your revenue does not grow, you owe us nothing.",
  },
  {
    question: "What share of the revenue do you take?",
    answer:
      "It is agreed per partnership before we start and depends on how much building the opportunity needs. It applies only to growth above your existing baseline, never to the revenue you already had.",
  },
  {
    question: "Why revenue share instead of fees?",
    answer:
      "Hourly billing pays agencies for effort, not results. We removed the retainer, so the only way for us to get paid is to grow your revenue.",
  },
  {
    question: "How do you measure the revenue you create?",
    answer:
      "Before we begin, we agree on a baseline and on how new organic revenue is attributed: analytics, order data or bookings. Both sides see the same dashboard.",
  },
  {
    question: "How long before it pays off?",
    answer:
      "Search compounds slowly, then quickly. Software and technical fixes land in weeks; rankings and revenue typically move within months. The waiting costs you nothing because we finance the ramp.",
  },
];

const navItems = [
  ["The model", "#model"],
  ["The work", "#work"],
  ["The terms", "#terms"],
  ["Questions", "#questions"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [activeScene, setActiveScene] = useState<SceneKey>("hero");
  const [sceneTransition, setSceneTransition] = useState(0);
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [sceneMix, setSceneMix] = useState(1);
  const activeFrameRef = useRef(0);
  const activeSceneRef = useRef<SceneKey>("hero");

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      setPointer({ x, y });
    };
    window.addEventListener("pointermove", handlePointer, { passive: true });
    const sceneSections = [
      ["top", "hero"], ["model", "model"], ["terms", "fit"], ["work", "work"],
      ["questions", "questions"], ["application", "application"],
    ] as const;
    let lastY = window.scrollY;
    let raf = 0;
    const updateScene = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const marker = window.scrollY + window.innerHeight * 0.42;
        let next: SceneKey = "hero";
        let scenePosition = 0;
        sceneSections.forEach(([id, key], index) => {
          const node = document.getElementById(id);
          const nextNode = sceneSections[index + 1] ? document.getElementById(sceneSections[index + 1][0]) : null;
          if (node && node.offsetTop <= marker) {
            next = key;
            const end = nextNode?.offsetTop ?? document.documentElement.scrollHeight;
            scenePosition = Math.max(0, Math.min(1, (marker - node.offsetTop) / Math.max(1, end - node.offsetTop)));
          }
        });
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        setScrollProgress(window.scrollY / maxScroll);
        setScrollVelocity(Math.max(-1, Math.min(1, (window.scrollY - lastY) / 180)));
        lastY = window.scrollY;
        const denseKey = denseForScene[next];
        if (denseKey) {
          const frames = denseFrames[denseKey];
          const nextFrame = Math.min(frames.length - 1, Math.round(scenePosition * (frames.length - 1)));
          activeFrameRef.current = nextFrame;
          setActiveFrameIndex((value) => value === nextFrame ? value : nextFrame);
        } else {
          activeFrameRef.current = 0;
          setActiveFrameIndex(0);
        }
        setSceneMix(next === "hero" ? 1 : scenePosition);
        if (next !== activeSceneRef.current) {
          activeSceneRef.current = next;
          setActiveScene(next);
          setSceneTransition((value) => value + 1);
        }
      });
    };
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    document.querySelectorAll(".reveal-section").forEach((section) => revealObserver.observe(section));
    updateScene();
    window.addEventListener("scroll", updateScene, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      revealObserver.disconnect();
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", updateScene);
    };
  }, []);

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main
      className="site-shell"
      style={{
        "--pointer-x": `${pointer.x * 24}px`,
        "--pointer-y": `${pointer.y * 18}px`,
        "--scroll-progress": scrollProgress,
        "--scroll-velocity": scrollVelocity,
        "--scene-mix": sceneMix,
      } as CSSProperties}
    >
      <div className="global-scene" aria-hidden="true">
        <div className="scene-grid" />
        <SceneLayer key={`${activeScene}-${sceneTransition}`} scene={activeScene} frameIndex={activeFrameIndex} className="scene-image scene-image-to" style={{ opacity: 1 }} />
        <div className="scene-vignette" />
        <div className="scene-scanline" />
        <div className="scene-transition-grain" />
        <div className="scene-coordinate scene-coordinate-a">48°51′N / 02°21′E</div>
        <div className="scene-coordinate scene-coordinate-b">OBJECT / {String(Object.keys(sceneFilms).indexOf(activeScene) + 1).padStart(2, "0")}</div>
        <div className="reference-markers reference-left" aria-hidden="true"><span>4</span><span>5</span><span>7</span><span>8</span><span>9</span><span>10</span></div>
        <div className="reference-marker marker-top" aria-hidden="true">2</div>
        <div className="reference-marker marker-apply" aria-hidden="true">6</div>
        <div className="reference-marker marker-cta" aria-hidden="true">11</div>
        <div className="reference-marker marker-bottom" aria-hidden="true">3</div>
      </div>
      <header className="site-header">
        <button className="logo-lockup" onClick={() => scrollTo("#top")} aria-label="Back to top">
          <img src={pearMark} alt="" className="brand-mark" />
          <span>PEAR</span>
        </button>
        <div className="header-meta">
          <a className="email-link" href="mailto:info@pear.no">INFO@PEAR.NO</a>
          <button className="apply-link" onClick={() => setApplicationOpen(true)}>APPLY <ArrowUpRight size={12} strokeWidth={1.4} /></button>
          <button className="menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={16} strokeWidth={1.4} />
            <span>MENU</span>
          </button>
        </div>
      </header>

      <div className={`menu-drawer ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="menu-wash" />
        <div className="drawer-topline">
          <span className="eyebrow">INDEX / 00—04</span>
          <button className="close-button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <nav className="drawer-nav">
          {navItems.map(([label, href], index) => (
            <button key={href} onClick={() => scrollTo(href)}>
              <span className="drawer-index">0{index + 1}</span>
              <span>{label}</span>
              <ArrowUpRight size={18} strokeWidth={1.4} />
            </button>
          ))}
        </nav>
        <div className="drawer-footer">
          <span>PEAR AS · OSLO</span>
          <a href="mailto:info@pear.no">INFO@PEAR.NO</a>
        </div>
      </div>

      <section id="top" className="hero-section section-rule">
        <div className="hero-grid" aria-hidden="true" />
        <div className="crosshair crosshair-top" />
        <div className="crosshair crosshair-bottom" />
        <div className="hero-copy">
          <h1 className="hero-title reveal reveal-2">Pear makes you appear.</h1>
          <p className="hero-subtitle reveal reveal-3">Not an agency on the clock,<br />a partner in the upside.</p>
          <button className="signal-button signal-button-reference reveal reveal-4" onClick={() => setApplicationOpen(true)}>
            <span>REQUEST PARTNERSHIP</span><ArrowUpRight size={15} strokeWidth={1.4} />
          </button>
        </div>
        <div className="hero-bottomline">
          <span className="eyebrow">AT YOUR SERVICE</span>
          <p>We build custom software, rank it where customers search, and take our pay as a share of the revenue it earns. No retainers, no hours: if you don’t grow, we don’t get paid.</p>
          <span className="scroll-note">SCROLL TO EXPLORE <span>↓</span></span>
        </div>
      </section>

      <section id="model" className="statement-section section-rule reveal-section">
        <div className="section-number">01</div>
        <div className="section-label eyebrow">THE MODEL</div>
        <div className="statement-content">
          <h2>No fees.<br /><em>A share</em><br />of the upside.</h2>
          <p className="lead-copy">You pay nothing to start: no retainer, no project fee, no hours on a clock. We carry the cost of strategy, development, content and links.</p>
          <div className="disclosure-block">
            <span className="eyebrow">FULL DISCLOSURE</span>
            <p>Our pay is an agreed share of the revenue the work creates, measured against your baseline and visible to both sides. You keep everything we build: the software, the content, the rankings.</p>
          </div>
        </div>
        <div className="model-signal"><span>30%</span><span>ABOVE BASELINE</span><i /></div>
      </section>

      <section id="terms" className="fit-section section-rule reveal-section">
        <div className="section-number">02</div>
        <div className="section-label eyebrow">THE FIT</div>
        <div className="fit-content">
          <h2>We say no<br /><em>more often</em><br />than yes.</h2>
          <div className="fit-details">
            <p>Our partners sell real products and services, have revenue to grow, and compete in markets where customers search: e-commerce, SaaS, marketplaces, service companies.</p>
            <div className="not-for-you">
              <span className="eyebrow">NOT FOR EVERYONE</span>
              <p>If you’re pre-revenue, want to rent developers by the hour, or need results by Friday, we’re the wrong partner. We’ll tell you in the first call.</p>
            </div>
          </div>
        </div>
        <div className="fit-stamp">SELECTIVE<br /><strong>BY DESIGN</strong></div>
      </section>

      <section id="work" className="work-section section-rule reveal-section">
        <div className="work-copy">
          <div className="section-number">03</div>
          <div className="section-label eyebrow">THE WORK</div>
          <h2>Everything it takes<br />to be <em>found,</em><br />under one roof.</h2>
          <div className="work-subblock">
            <span className="eyebrow">SEARCH ENGINE OPTIMIZATION</span>
            <h3>Search and software are one <em>discipline</em> at Pear.</h3>
            <p>The product is built to rank from its first commit, and the SEO is done by the people who wrote the code.</p>
          </div>
          <div className="work-subblock">
            <span className="eyebrow">CUSTOM SOFTWARE</span>
            <h3>We design and build the thing being <em>ranked.</em></h3>
            <p>Storefronts, marketplaces, booking systems — the machinery a modern company sells through.</p>
          </div>
        </div>
      </section>

      <section className="capability-section section-rule reveal-section">
        <div className="section-label eyebrow">THE BUILD</div>
        <div className="capability-grid">
          <div className="capability-title"><span className="section-number">04</span><h2>Built to rank<br /><em>from the first commit.</em></h2></div>
          <p>Most software is built first and optimized later, which is backwards. Architecture, speed and structure decide rankings before the first word of copy is written.</p>
          <p>Ours ships fast, renders clean, and gives search engines a site they can read without excuses.</p>
        </div>
      </section>

      <section id="questions" className="questions-section section-rule reveal-section">
        <div className="section-number">05</div>
        <div className="section-label eyebrow">ASKED BEFORE</div>
        <div className="questions-content">
          <h2>The short<br /><em>version.</em></h2>
          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div className={`faq-item ${isOpen ? "is-open" : ""}`} key={faq.question}>
                  <button onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                    <span>{faq.question}</span><ChevronDown size={18} strokeWidth={1.3} />
                  </button>
                  <div className="faq-answer"><p>{faq.answer}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="application-section section-rule reveal-section">
        <div className="application-mark"><img src={pearMark} alt="" /><span>PEAR / APPLY</span></div>
        <div className="application-copy">
          <span className="eyebrow">THE APPLICATION</span>
          <h2>Make your next<br /><em>move visible.</em></h2>
          <p>Tell us what you sell and where you want to grow. Every application is read, and when the model fits we answer within a week.</p>
          <button className="signal-button signal-button-light" onClick={() => setApplicationOpen(true)}>
            <span>SEND THE APPLICATION</span><ArrowUpRight size={15} strokeWidth={1.4} />
          </button>
        </div>
        <div className="application-foot"><span>PEAR AS · ORG NR 919 062 517 · OSLO</span><a href="mailto:info@pear.no">INFO@PEAR.NO</a></div>
      </section>

      <footer className="site-footer">
        <span>PEAR MAKES YOU APPEAR.</span>
        <span>© 2026 PEAR AS</span>
        <button onClick={() => scrollTo("#top")} aria-label="Back to top">BACK TO TOP ↑</button>
      </footer>

      <div className={`application-modal ${applicationOpen ? "is-open" : ""}`} aria-hidden={!applicationOpen}>
        <div className="modal-panel">
          <div className="modal-header"><span className="eyebrow">REQUEST / PARTNERSHIP</span><button onClick={() => setApplicationOpen(false)} aria-label="Close application"><X size={18} /></button></div>
          <h2>Tell us where<br /><em>you want to grow.</em></h2>
          <p>We read every application. If the model fits, we’ll be in touch within a week.</p>
          <a className="signal-button signal-button-light" href="mailto:info@pear.no?subject=Partnership%20application">EMAIL PEAR <ArrowUpRight size={15} /></a>
          <span className="modal-note">INFO@PEAR.NO / OSLO / REVENUE SHARE ONLY</span>
        </div>
      </div>
    </main>
  );
}
