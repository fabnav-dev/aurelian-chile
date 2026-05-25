/* App — El viaje de Aurelian por Chile / Aurelians Reise durch Chile */
const { useState, useEffect, useRef, useCallback } = React;

const CHAPTERS = window.CHAPTERS;
const I18N = window.I18N;

// Helper: pick localized value from {es, de} object
const loc = (val, lang) => (val && typeof val === 'object' && val[lang] != null) ? val[lang] : val;

// ============ ICONS ============
const Icon = {
  share: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  ),
  heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9C.7 8.5 2.5 4 6.5 4c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3 4 0 5.8 4.5 4 8-2.5 4.5-9.5 9-9.5 9z"/></svg>
  ),
  pin: () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  arrow: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  copy: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  whatsapp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l.6.953-1.005 3.668 3.764-.985z"/></svg>
  ),
  home: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L12 3l9 9" /><path d="M5 10v10h14V10" />
    </svg>
  )
};

// ============ CHILE SHAPE ============
const ChileShape = ({ lang }) => {
  const labels = lang === 'de'
    ? ['Tirana', 'Valpo', 'Fonda', 'Biobío', 'Ruca', 'Chiloé']
    : ['Tirana', 'Valpo', 'Fonda', 'Biobío', 'Ruca', 'Chiloé'];
  const pins = [30, 90, 130, 175, 200, 250];
  return (
    <svg viewBox="0 0 60 280" width="44" height="200" className="chile-shape">
      <defs>
        <linearGradient id="chileGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e8a89a" stopOpacity="0.6"/>
          <stop offset="50%" stopColor="#c25450" stopOpacity="0.45"/>
          <stop offset="100%" stopColor="#2a4a78" stopOpacity="0.4"/>
        </linearGradient>
      </defs>
      <path d="M28 4 Q34 18 32 38 Q30 60 33 80 Q36 100 32 122 Q28 144 31 168 Q34 192 30 214 Q26 236 28 256 Q30 270 26 278 Q22 270 24 256 Q26 240 22 218 Q19 196 23 172 Q26 148 22 124 Q19 102 23 80 Q26 60 24 38 Q22 18 28 4 Z"
        fill="url(#chileGrad)" stroke="#9a3a3a" strokeWidth="0.8" opacity="0.9"/>
      {pins.map((y, i) => (
        <g key={i}>
          <circle cx="28" cy={y} r="3.5" fill="#c25450" stroke="#fff" strokeWidth="1.2"/>
          <text x="40" y={y + 3.5} fontSize="8" fill="#56535f" fontFamily="Caveat, cursive" fontWeight="700">{labels[i]}</text>
        </g>
      ))}
    </svg>
  );
};

// ============ FLAG RIBBON SVG ============
function FlagRibbon() {
  return (
    <svg className="cover-ribbon" viewBox="0 0 460 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blueShade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#1d3a6b"/>
          <stop offset="50%" stopColor="#2a4a78"/>
          <stop offset="100%" stopColor="#16294d"/>
        </linearGradient>
        <linearGradient id="whiteShade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="55%" stopColor="#f4f1ec"/>
          <stop offset="100%" stopColor="#d8d4cb"/>
        </linearGradient>
        <linearGradient id="redShade" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#e8403a"/>
          <stop offset="50%" stopColor="#c52a26"/>
          <stop offset="100%" stopColor="#7d1815"/>
        </linearGradient>
        <linearGradient id="redShade2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#d12d29"/>
          <stop offset="100%" stopColor="#85181a"/>
        </linearGradient>
        <filter id="ribbonShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
          <feOffset dx="0" dy="8" result="off"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.35"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g filter="url(#ribbonShadow)">
        <path d="M -40 180 Q 30 110, 130 130 L 130 240 Q 30 220, -40 290 Z" fill="url(#blueShade)"/>
        <polygon points="60,180 65.3,196.3 82.5,196.3 68.6,206.4 73.9,222.7 60,212.6 46.1,222.7 51.4,206.4 37.5,196.3 54.7,196.3" fill="#ffffff"/>
        <path d="M 130 130 Q 220 145, 310 110 Q 380 84, 460 95 L 460 205 Q 380 194, 310 220 Q 220 255, 130 240 Z" fill="url(#whiteShade)"/>
        <path d="M -40 290 Q 30 220, 130 240 Q 220 255, 310 220 Q 380 194, 460 205 L 460 320 Q 380 308, 310 335 Q 220 370, 130 355 Q 30 335, -40 405 Z" fill="url(#redShade)"/>
      </g>
      <circle cx="380" cy="780" r="140" fill="#c25450" opacity="0.05"/>
      <circle cx="40" cy="600" r="120" fill="#2a4a78" opacity="0.04"/>
      <circle cx="240" cy="850" r="100" fill="#c25450" opacity="0.04"/>
      <g filter="url(#ribbonShadow)" opacity="0.85">
        <path d="M 280 880 Q 340 855, 400 875 Q 440 887, 480 880 L 480 920 Q 440 925, 400 915 Q 340 898, 280 920 Z" fill="url(#redShade2)"/>
      </g>
    </svg>
  );
}

// ============ LANGUAGE TOGGLE ============
function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="radiogroup" aria-label="Language">
      <button
        className={`lang-opt ${lang === 'es' ? 'active' : ''}`}
        onClick={() => setLang('es')}
        aria-pressed={lang === 'es'}
      >ES</button>
      <button
        className={`lang-opt ${lang === 'de' ? 'active' : ''}`}
        onClick={() => setLang('de')}
        aria-pressed={lang === 'de'}
      >DE</button>
    </div>
  );
}

// ============ COVER ============
function Cover({ onStart, t }) {
  return (
    <section className="cover" data-screen-label="01 Cover">
      <FlagRibbon />
      <div className="cover-stamp">
        <div className="cover-stamp-left">
          <span className="bar"></span>
          <span>{t.coverStampLeft}</span>
        </div>
        <div className="cover-stamp-right">{t.coverStampRight}</div>
      </div>
      <div className="cover-content" style={{ marginTop: 'auto' }}>
        <div className="cover-eyebrow">{t.coverEyebrow}</div>
        <h1 className="cover-title">
          {t.coverTitle1}<br/>
          <em>{t.coverTitle2}</em><br/>
          <span className="accent">{t.coverTitle3}</span>
        </h1>
        <p className="cover-sub">{t.coverSub}</p>
      </div>
      <div className="cover-bottom">
        <button className="cover-cta" onClick={onStart}>
          {t.coverCta} <span className="arrow"><Icon.arrow /></span>
        </button>
        <div className="cover-meta">
          {t.coverAge}<br/>
          <strong>{t.coverAgeYear}</strong>
        </div>
      </div>
    </section>
  );
}

// ============ MAP INTRO ============
function MapIntro({ t, lang }) {
  return (
    <section className="map-intro" data-screen-label="02 Mapa">
      <div className="map-intro-eyebrow">{t.mapEyebrow}</div>
      <h2 className="map-intro-title">{t.mapTitle1}<br/>{t.mapTitle2}</h2>
      <ChileShape lang={lang} />
      <p className="map-intro-body">{t.mapBody}</p>
      <div className="brush-break"></div>
    </section>
  );
}

// ============ CHAPTER ============
function Chapter({ ch, lang, onPhotoClick }) {
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const title = loc(ch.title, lang);
  const region = loc(ch.region, lang);
  const place = loc(ch.place, lang);
  const heroCaption = loc(ch.heroCaption, lang);
  const pin = loc(ch.pin, lang);
  const body = loc(ch.body, lang);
  const quote = loc(ch.quote, lang);
  const facts = loc(ch.facts, lang);

  return (
    <section className="chapter reveal" ref={ref} data-screen-label={`${ch.num} ${title}`}>
      <div className="chapter-divider">
        <div className="chapter-num">{ch.num}</div>
        <div className="chapter-region">{region}</div>
      </div>
      <h2 className="chapter-title">{title}</h2>
      <div className="chapter-place">~ {place} ~</div>

      <div className="hero-frame" onClick={() => onPhotoClick(ch.hero)}>
        <img src={ch.hero} alt={title} loading="lazy" />
        <div className="hero-caption">
          <span>{heroCaption}</span>
          <span className="hero-pin"><Icon.pin /> {pin}</span>
        </div>
      </div>

      <p className="chapter-body">{body}</p>

      <div className="polaroid-row">
        {ch.polaroids.map((p, i) => (
          <div key={i} className="polaroid" onClick={() => onPhotoClick(p.src)}>
            <div className="pic" style={{ backgroundImage: `url(${p.src})` }} />
            <div className="label">{loc(p.label, lang)}</div>
          </div>
        ))}
      </div>

      <div className="story-quote">{quote}</div>

      <div className="fact-pills">
        {facts.map((f, i) => (
          <span key={i} className="fact-pill"><span className="dot"></span>{f}</span>
        ))}
      </div>

      <div className="brush-break" style={{ marginTop: 36 }}></div>
    </section>
  );
}

// ============ CLOSING ============
function Closing({ t, onShare, onCopy, onWhatsApp, onTop }) {
  return (
    <section className="closing" data-screen-label="08 Para la tía">
      <span className="closing-heart"><Icon.heart /></span>
      <div className="closing-eyebrow">{t.closingHeart}</div>
      <h2 className="closing-title">{t.closingTitle1}<br/>{t.closingTitle2}</h2>
      <div className="closing-letter" dangerouslySetInnerHTML={{ __html: t.closingLetter }} />

      <div className="share-bar">
        <button className="share-btn primary" onClick={onShare}>
          <Icon.share /> {t.btnShare}
        </button>
        <button className="share-btn" onClick={onWhatsApp}>
          <Icon.whatsapp /> {t.btnWhatsApp}
        </button>
        <button className="share-btn ghost" onClick={onCopy}>
          <Icon.copy /> {t.btnCopy}
        </button>
      </div>

      <div className="signature">
        {t.signatureLine1}<br/>
        <span style={{ fontSize: 28, color: 'var(--rose)' }}>{t.signatureName}</span><br/>
        <div className="stamp">{t.signatureStamp}</div>
      </div>

      <button className="share-btn ghost" style={{ marginTop: 30 }} onClick={onTop}>
        <Icon.home /> {t.btnHome}
      </button>
    </section>
  );
}

// ============ APP ============
function App() {
  // Init lang from localStorage > browser > default
  const initLang = () => {
    const saved = localStorage.getItem('aurelian-lang');
    if (saved === 'es' || saved === 'de') return saved;
    const nav = (navigator.language || 'es').toLowerCase();
    return nav.startsWith('de') ? 'de' : 'es';
  };

  const [lang, setLangState] = useState(initLang);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const scrollRef = useRef(null);

  const t = I18N[lang];

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem('aurelian-lang', l);
  };

  // Update document attrs when lang changes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.docTitle;
  }, [lang]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const start = useCallback(() => {
    const el = document.querySelector('[data-screen-label="02 Mapa"]');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const toTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleShare = async () => {
    const data = {
      title: t.docTitle,
      text: t.shareText,
      url: window.location.href
    };
    if (navigator.share) {
      try { await navigator.share(data); }
      catch (e) { /* user cancelled */ }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast(t.toastCopied);
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast(t.toastCopied);
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`${t.waMessage}\n${window.location.href}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  };

  return (
    <div className="app">
      <div className="paper-bg"></div>

      <header className="topbar">
        <div className="topbar-title">{t.topbarTitle}</div>
        <div className="topbar-actions">
          <LangToggle lang={lang} setLang={setLang} />
          <button className="icon-btn" onClick={toTop} aria-label={t.btnInicio}><Icon.home /></button>
          <button className="icon-btn" onClick={handleShare} aria-label={t.btnShare}><Icon.share /></button>
        </div>
      </header>

      <div className="progress-rail">
        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      <main className="scroll-area" ref={scrollRef}>
        <Cover onStart={start} t={t} />
        <MapIntro t={t} lang={lang} />
        {CHAPTERS.map((ch) => (
          <Chapter key={ch.num} ch={ch} lang={lang} onPhotoClick={setLightbox} />
        ))}
        <Closing
          t={t}
          onShare={handleShare}
          onCopy={handleCopy}
          onWhatsApp={handleWhatsApp}
          onTop={toTop}
        />
      </main>

      {toast && <div className="toast">{toast}</div>}
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <img src={lightbox} alt="" />
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
