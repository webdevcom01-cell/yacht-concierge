import React from 'react';

// Per-service hero illustrations for the seven service detail pages.
// Construction language: gradient sky, horizon, sea reflections, cream
// silhouette motif, corner mono label. Everything is original vector
// art in the brand palette — no stock photography, no licensing exposure.
// (The same visual language was shared with the marina scenes on the old
// /fleet coast map, removed from the site.)

const SCENES = {
  berth: {
    skyTop: '#020E1C', skyMid: '#0a2c4f', skyBot: '#1a3e5e',
    seaTop: '#16354d', seaBot: '#03162a',
    glow: '#EFEAE2', glowR: 26,
  },
  customs: {
    skyTop: '#0A1420', skyMid: '#1E3A50', skyBot: '#3A5A72',
    seaTop: '#1A3648', seaBot: '#0A1E2C',
    glow: '#B0C4D8', glowR: 22,
  },
  fuel: {
    skyTop: '#0C1418', skyMid: '#243842', skyBot: '#3E5A64',
    seaTop: '#1C2E34', seaBot: '#0A1618',
    glow: '#D8C468', glowR: 24,
  },
  provisioning: {
    skyTop: '#1C1008', skyMid: '#5A3517', skyBot: '#A6672C',
    seaTop: '#2A4048', seaBot: '#101E24',
    glow: '#E8A85A', glowR: 34,
  },
  laundry: {
    skyTop: '#14283A', skyMid: '#2E5A78', skyBot: '#5A8CA8',
    seaTop: '#2A5A6E', seaBot: '#12303C',
    glow: '#DCE8F0', glowR: 24,
  },
  floristry: {
    skyTop: '#2A1218', skyMid: '#6E3040', skyBot: '#B86458',
    seaTop: '#3A2E38', seaBot: '#181018',
    glow: '#E8B4A0', glowR: 30,
  },
  maintenance: {
    skyTop: '#100C08', skyMid: '#3A2A18', skyBot: '#6E4A24',
    seaTop: '#22303A', seaBot: '#0A1218',
    glow: '#D8A860', glowR: 24,
  },
};

const CREAM = (a) => `rgba(239,234,226,${a})`;

// ── Motifs — one silhouette scene per service ────────────────────────────────

function BerthMotif() {
  return (
    <g>
      {/* Dock from the right */}
      <rect x="252" y="146" width="148" height="5" fill={CREAM(0.5)}/>
      <rect x="252" y="151" width="148" height="1.4" fill={CREAM(0.18)}/>
      {[268, 306, 344, 382].map(x => (
        <rect key={x} x={x} y="151" width="4" height="12" fill={CREAM(0.35)}/>
      ))}
      {/* Bollard */}
      <rect x="284" y="138" width="7" height="8" rx="1.5" fill={CREAM(0.6)}/>
      {/* Moored yacht (left of dock) */}
      <g transform="translate(96, 142)">
        <rect x="0" y="4" width="88" height="5" fill={CREAM(0.6)}/>
        <path d="M0 4 L11 0 L77 0 L88 4 Z" fill={CREAM(0.8)}/>
        <rect x="22" y="-10" width="44" height="10" fill={CREAM(0.55)}/>
        <rect x="31" y="-18" width="26" height="8" fill={CREAM(0.45)}/>
        <line x1="44" y1="-25" x2="44" y2="-18" stroke={CREAM(0.4)} strokeWidth="0.7"/>
      </g>
      {/* Mooring line to the bollard */}
      <path d="M184 148 Q 236 160 287 141" fill="none" stroke={CREAM(0.4)} strokeWidth="0.8"/>
    </g>
  );
}

function CustomsMotif() {
  return (
    <g>
      {/* Harbour office silhouette */}
      <rect x="284" y="112" width="86" height="38" fill={CREAM(0.28)}/>
      <path d="M280 112 L327 96 L374 112 Z" fill={CREAM(0.4)}/>
      {[296, 318, 340].map(x => (
        <rect key={x} x={x} y="124" width="9" height="11" fill="rgba(10,20,32,0.7)"/>
      ))}
      {/* Flag mast */}
      <line x1="262" y1="150" x2="262" y2="88" stroke={CREAM(0.55)} strokeWidth="1.4"/>
      <path d="M262 88 L286 93 L262 99 Z" fill={CREAM(0.65)}/>
      {/* Stamp ring framing the orb */}
      <circle cx="120" cy="70" r="34" fill="none" stroke={CREAM(0.35)} strokeWidth="1.2" strokeDasharray="5 4"/>
      <circle cx="120" cy="70" r="25" fill="none" stroke={CREAM(0.2)} strokeWidth="0.8"/>
    </g>
  );
}

function FuelMotif() {
  return (
    <g>
      {/* Dock edge on the right */}
      <rect x="252" y="146" width="148" height="5" fill={CREAM(0.5)}/>
      {/* Fuel pump silhouette */}
      <g transform="translate(280, 90)">
        <rect x="0" y="0" width="34" height="56" rx="2" fill={CREAM(0.5)}/>
        <rect x="6" y="8" width="22" height="14" fill="rgba(10,20,32,0.55)"/>
        <path d="M34 20 h14 a8 8 0 0 1 8 8 v20 a5 5 0 0 0 10 0 v-24 l-8 -10" fill="none" stroke={CREAM(0.55)} strokeWidth="2.4"/>
      </g>
      {/* Gauge ring around the orb */}
      <circle cx="112" cy="66" r="28" fill="none" stroke={CREAM(0.35)} strokeWidth="1.4" strokeDasharray="4 5"/>
      <circle cx="112" cy="66" r="19" fill="none" stroke={CREAM(0.2)} strokeWidth="0.8"/>
      <line x1="112" y1="66" x2="122" y2="52" stroke={CREAM(0.55)} strokeWidth="1.6"/>
    </g>
  );
}

function ProvisioningMotif() {
  return (
    <g>
      {/* Dock edge on the left */}
      <rect x="0" y="146" width="188" height="5" fill={CREAM(0.5)}/>
      {/* Stacked market crates */}
      {[
        [26, 116, 34, 28], [64, 122, 30, 22],
        [30, 90, 26, 24], [100, 128, 36, 17],
      ].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h} fill="none" stroke={CREAM(0.6)} strokeWidth="1.3"/>
          <line x1={x} y1={y + h / 2} x2={x + w} y2={y + h / 2} stroke={CREAM(0.35)} strokeWidth="0.8"/>
          <line x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} stroke={CREAM(0.25)} strokeWidth="0.8"/>
        </g>
      ))}
      {/* Gulls */}
      <path d="M292 58 q5 -6 10 0 q5 -6 10 0" fill="none" stroke={CREAM(0.45)} strokeWidth="1.1"/>
      <path d="M330 42 q4 -5 8 0 q4 -5 8 0" fill="none" stroke={CREAM(0.35)} strokeWidth="1"/>
    </g>
  );
}

function LaundryMotif() {
  return (
    <g>
      {/* Posts + line */}
      <line x1="70" y1="150" x2="70" y2="72" stroke={CREAM(0.55)} strokeWidth="1.6"/>
      <line x1="330" y1="150" x2="330" y2="72" stroke={CREAM(0.55)} strokeWidth="1.6"/>
      <path d="M70 78 Q 200 92 330 78" fill="none" stroke={CREAM(0.5)} strokeWidth="1"/>
      {/* Hanging linen */}
      {[[104, 40], [172, 52], [252, 44]].map(([x, w], i) => (
        <path key={i}
          d={`M${x} ${82 + i * 2} L${x + w} ${83 + i * 2} L${x + w} ${120 + i * 3} Q ${x + w / 2} ${128 + i * 3} ${x} ${120 + i * 3} Z`}
          fill={CREAM(0.5 - i * 0.08)}/>
      ))}
      {/* Pegs */}
      {[104, 144, 172, 212, 252, 296].map(x => (
        <circle key={x} cx={x} cy={81 + (x > 200 ? 3 : 1)} r="1.6" fill={CREAM(0.7)}/>
      ))}
    </g>
  );
}

function FloristryMotif() {
  return (
    <g>
      {/* Stems from the lower left */}
      {[
        ['M40 150 Q 46 108 38 76', 38, 74, 5],
        ['M62 150 Q 58 116 70 92', 71, 90, 4],
        ['M88 150 Q 96 120 90 104', 90, 102, 3.4],
      ].map(([d, cx, cy, r], i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={CREAM(0.55)} strokeWidth="1.2"/>
          {/* Blossom — five petals */}
          {[0, 72, 144, 216, 288].map(a => (
            <circle key={a}
              cx={cx + r * 1.25 * Math.cos((a * Math.PI) / 180)}
              cy={cy + r * 1.25 * Math.sin((a * Math.PI) / 180)}
              r={r * 0.85} fill={CREAM(0.4)}/>
          ))}
          <circle cx={cx} cy={cy} r={r * 0.7} fill={CREAM(0.75)}/>
        </g>
      ))}
      {/* Leaves */}
      <path d="M52 128 q 12 -4 16 -14 q -14 2 -16 14" fill={CREAM(0.35)}/>
      <path d="M76 136 q -12 -4 -14 -14 q 12 2 14 14" fill={CREAM(0.3)}/>
    </g>
  );
}

function MaintenanceMotif() {
  return (
    <g>
      {/* Hull on stands (dry dock) */}
      <g transform="translate(236, 108)">
        <path d="M0 18 L14 0 L118 0 L132 18 L112 30 L20 30 Z" fill={CREAM(0.5)}/>
        <line x1="20" y1="30" x2="112" y2="30" stroke={CREAM(0.25)} strokeWidth="1"/>
        <rect x="34" y="34" width="7" height="12" fill={CREAM(0.45)}/>
        <rect x="92" y="34" width="7" height="12" fill={CREAM(0.45)}/>
      </g>
      {/* Gear ring around the orb */}
      <circle cx="112" cy="66" r="30" fill="none" stroke={CREAM(0.4)} strokeWidth="2.4" strokeDasharray="6 7"/>
      <circle cx="112" cy="66" r="21" fill="none" stroke={CREAM(0.25)} strokeWidth="1"/>
      {/* Wrench silhouette */}
      <g transform="rotate(38 60 128)">
        <rect x="52" y="124" width="34" height="4.5" rx="2" fill={CREAM(0.5)}/>
        <circle cx="50" cy="126" r="6.5" fill="none" stroke={CREAM(0.5)} strokeWidth="4"/>
      </g>
    </g>
  );
}

const MOTIFS = {
  berth: BerthMotif,
  customs: CustomsMotif,
  fuel: FuelMotif,
  provisioning: ProvisioningMotif,
  laundry: LaundryMotif,
  floristry: FloristryMotif,
  maintenance: MaintenanceMotif,
};

// ── ServiceArt ────────────────────────────────────────────────────────────────

export function ServiceArt({ id, label }) {
  const p = SCENES[id] || SCENES.berth;
  const Motif = MOTIFS[id] || BerthMotif;
  return (
    <svg
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <defs>
        <linearGradient id={`sa-sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skyTop}/>
          <stop offset="55%" stopColor={p.skyMid}/>
          <stop offset="100%" stopColor={p.skyBot}/>
        </linearGradient>
        <linearGradient id={`sa-sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.seaTop}/>
          <stop offset="100%" stopColor={p.seaBot}/>
        </linearGradient>
        <radialGradient id={`sa-glow-${id}`} cx="28%" cy="30%" r="32%">
          <stop offset="0%" stopColor={p.glow} stopOpacity="0.2"/>
          <stop offset="100%" stopColor={p.glow} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="152" fill={`url(#sa-sky-${id})`}/>
      <rect width="400" height="152" fill={`url(#sa-glow-${id})`}/>
      {/* Sea */}
      <rect y="152" width="400" height="88" fill={`url(#sa-sea-${id})`}/>
      {/* Horizon */}
      <line x1="0" y1="152" x2="400" y2="152" stroke={p.glow} strokeOpacity="0.18" strokeWidth="0.6"/>

      {/* Orb */}
      <circle cx="112" cy="66" r={p.glowR} fill={p.glow} fillOpacity="0.07"/>
      <circle cx="112" cy="66" r={p.glowR * 0.6} fill={p.glow} fillOpacity="0.11"/>

      {/* Stars */}
      {[[40, 24], [86, 14], [140, 34], [188, 18], [238, 30], [286, 12], [338, 26], [376, 40], [206, 44]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.8" fill={p.glow} fillOpacity="0.4"/>
      ))}

      {/* Service motif */}
      <Motif/>

      {/* Sea reflection lines */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line key={i} x1="0" y1={162 + i * 12} x2="400" y2={162 + i * 12}
          stroke={p.glow} strokeOpacity="0.05" strokeWidth="0.5"/>
      ))}

      {/* Corner label */}
      <text x="12" y="230" fontFamily="var(--mono)" fontSize="8"
        letterSpacing="2" fill={CREAM(0.4)} textAnchor="start"
        style={{ textTransform: 'uppercase' }}>
        {label}
      </text>
    </svg>
  );
}
