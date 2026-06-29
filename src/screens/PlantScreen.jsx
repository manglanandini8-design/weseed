import { Settings, Trophy, TrendingUp, MapPin, Users, Sparkles, Lock, Check, Leaf, Share2 } from 'lucide-react'
import PlantSVG from '../components/PlantSVG'
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// ─── XP & Growth Logic ────────────────────────────────────────────────────────
// Every submitted report = 20 XP
// Every resolved report  = 30 XP (bonus on top of the 20)
// So a resolved report is worth 50 XP total, open report is 20 XP
const XP_PER_REPORT   = 20;
const XP_BONUS_RESOLVED = 30;

const STAGES = [
  { label: 'Seed',   state: 'locked', minXP: 0   },
  { label: 'Sprout', state: 'locked', minXP: 50  },
  { label: 'Plant',  state: 'locked', minXP: 150 },
  { label: 'Flower', state: 'locked', minXP: 300 },
  { label: 'Tree',   state: 'locked', minXP: 500 },
];

function computeGrowth(totalReports, resolved) {
  const xp = totalReports * XP_PER_REPORT + resolved * XP_BONUS_RESOLVED;

  // Which stage are we in?
  let stageIndex = 0;
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (xp >= STAGES[i].minXP) { stageIndex = i; break; }
  }

  const currentStage = STAGES[stageIndex];
  const nextStage    = STAGES[stageIndex + 1] || null;

  // Progress % within current stage
  const xpIntoStage = xp - currentStage.minXP;
  const stageRange  = nextStage ? nextStage.minXP - currentStage.minXP : 1;
  const pct         = nextStage ? Math.min(100, Math.round((xpIntoStage / stageRange) * 100)) : 100;

  const xpToNext = nextStage ? nextStage.minXP - xp : 0;

  // Build stages array with states
  const stages = STAGES.map((s, i) => ({
    ...s,
    state: i < stageIndex ? 'done' : i === stageIndex ? 'active' : 'locked',
  }));

  return { xp, stageIndex, stageLabel: currentStage.label, nextLabel: nextStage?.label || null, pct, xpToNext, stages };
}

// ─── Achievements (unlock based on real stats) ────────────────────────────────
function computeAchievements(totalReports, resolved) {
  return [
    { label: 'First Report',      icon: MapPin,     locked: totalReports < 1,  desc: 'Submit your first report' },
    { label: 'Problem Spotter',   icon: MapPin,     locked: totalReports < 5,  desc: '5 reports submitted' },
    { label: 'Community Builder', icon: Trophy,     locked: totalReports < 10, desc: '10 reports submitted' },
    { label: 'Resolver',          icon: Check,      locked: resolved < 1,      desc: 'First issue resolved' },
    { label: 'Env. Guardian',     icon: Leaf,       locked: resolved < 5,      desc: '5 issues resolved' },
    { label: 'Green Champion',    icon: Sparkles,   locked: resolved < 10,     desc: '10 issues resolved' },
  ];
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = () => {
      start += Math.ceil(value / 20);
      if (start >= value) { setDisplay(value); return; }
      setDisplay(start);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  return <span>{display}</span>;
}

const impactCardDefs = [
  { key: 'totalReports', icon: MapPin,    label: 'Spots reported', color: '#4ADE80' },
  { key: 'resolved',     icon: Check,     label: 'Resolved',       color: '#4ADE80' },
  { key: 'hotspots',     icon: Sparkles,  label: 'Hotspots',       color: '#fbbf24' },
  { key: 'pending',      icon: Trophy,    label: 'Pending',        color: '#f97316' },
];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function PlantScreen({ onDrives }) {
  const [stats, setStats]   = useState({ totalReports: 0, resolved: 0, pending: 0, hotspots: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));
      const reports  = snapshot.docs.map(d => d.data());
      const total    = reports.length;
      const resolved = reports.filter(r => r.status === 'Resolved').length;
      const hotspots = new Set(
        reports.filter(r => r.latitude && r.longitude)
               .map(r => `${Math.round(r.latitude)},${Math.round(r.longitude)}`)
      ).size;
      setStats({ totalReports: total, resolved, pending: total - resolved, hotspots });
      setLoaded(true);
    } catch (err) {
      console.error(err);
      setLoaded(true);
    }
  };

  const { xp, stageIndex, stageLabel, nextLabel, pct, xpToNext, stages } = computeGrowth(
    stats.totalReports, stats.resolved
  );
  const achievements = computeAchievements(stats.totalReports, stats.resolved);
  const isMaxed = stageIndex === STAGES.length - 1;

  // PlantSVG size grows slightly with stage
  const plantSize = 130 + stageIndex * 10;

  return (
    <div className="screen">
      <div className="scroll" style={{ overflowX: 'hidden' }}>

        {/* Profile */}
        <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #22C55E, #166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#fff', border: '2px solid #22C55E' }}>RS</div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#22C55E', border: '2px solid #0B0F0C' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Rajveer Singh</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '2px 7px', fontSize: 9, color: '#4ADE80', fontWeight: 500 }}>
                  <Trophy size={8} /> {xp} XP
                </span>
                <span style={{ background: 'rgba(134,239,172,0.08)', border: '0.5px solid rgba(134,239,172,0.2)', borderRadius: 20, padding: '2px 8px', fontSize: 9, color: '#86EFAC' }}>
                  {stageLabel}
                </span>
              </div>
            </div>
          </div>
          <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Settings size={15} color="var(--text-dim)" />
          </button>
        </div>

        {/* Plant hero */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0 0' }}>
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)', animation: 'pulseGlow 4s ease-in-out infinite', pointerEvents: 'none' }} />
          <PlantSVG size={plantSize} style={{ animation: 'gentleSway 6s ease-in-out infinite' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '4px 10px', fontSize: 10, color: '#4ADE80', marginTop: 8, zIndex: 2 }}>
            <span className="pulse-dot" />
            {isMaxed ? '🌳 Full Tree — Community Champion!' : `${stageLabel} · ${stats.resolved} resolved`}
          </div>
        </div>

        {/* XP bar */}
        <div style={{ padding: '16px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#86EFAC', fontWeight: 500 }}>
              {isMaxed ? 'Maximum growth reached 🌳' : `${pct}% to ${nextLabel}`}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{xp} XP</span>
          </div>
          <div style={{ width: '100%', height: 7, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #16a34a, #4ADE80)', borderRadius: 10, transition: 'width 1.5s ease-out' }} />
          </div>
          <div style={{ fontSize: 10, color: '#2d4a32', marginTop: 5 }}>
            {isMaxed
              ? 'Your community is thriving!'
              : `${xpToNext} XP to ${nextLabel} — resolve more reports to grow faster`}
          </div>
        </div>

        {/* Live Stats */}
        <div style={{ padding: '20px 20px 10px' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4ADE80', marginBottom: 12 }}>Community Impact</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {impactCardDefs.map(({ key, icon: Icon, label, color }) => (
              <div key={key} className="glass-card" style={{ padding: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color }}>
                  {loaded ? <AnimatedNumber value={stats[key]} /> : '—'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* XP breakdown hint */}
        <div style={{ margin: '0 20px', padding: '10px 12px', borderRadius: 12, background: 'rgba(34,197,94,0.04)', border: '0.5px solid rgba(34,197,94,0.1)', fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.7 }}>
          🌱 <span style={{ color: '#4ADE80' }}>+20 XP</span> per report submitted &nbsp;·&nbsp;
          ✅ <span style={{ color: '#4ADE80' }}>+30 XP</span> bonus per resolved report
        </div>

        {/* Timeline */}
        <div style={{ padding: '18px 20px 0' }}>
          <div style={{ fontSize: 10, color: '#2d4a32', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12, fontWeight: 500 }}>Growth journey</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 13, left: 14, right: 14, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: 13, left: 14, height: 1, width: `${(stageIndex / (STAGES.length - 1)) * 100}%`, background: 'linear-gradient(90deg, #22C55E, #4ADE80)', transition: 'width 1s ease-out' }} />
            {stages.map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, zIndex: 2 }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.state === 'done' ? '#22C55E' : s.state === 'active' ? '#0B0F0C' : 'rgba(255,255,255,0.04)', border: s.state === 'active' ? '2px solid #4ADE80' : s.state === 'locked' ? '0.5px solid rgba(255,255,255,0.08)' : 'none', boxShadow: s.state === 'active' ? '0 0 10px rgba(74,222,128,0.4)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
                  {s.state === 'done'   && <Check  size={11} color="#0B0F0C" />}
                  {s.state === 'active' && <Leaf   size={11} color="#4ADE80" />}
                  {s.state === 'locked' && <Lock   size={10} color="#2d4a32" />}
                </div>
                <span style={{ fontSize: 9, color: s.state === 'done' ? '#4ADE80' : s.state === 'active' ? '#86EFAC' : '#2d4a32' }}>{s.label}</span>
                <span style={{ fontSize: 8, color: '#2d4a32' }}>{s.minXP}xp</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px 8px' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#4ADE80' }}>Achievements</span>
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>
            {achievements.filter(a => !a.locked).length}/{achievements.length} unlocked
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, padding: '0 20px 4px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {achievements.map((a, i) => (
            <div key={a.label} className="glass-card" style={{
              flexShrink: 0, width: 88, padding: '12px 8px 10px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              opacity: a.locked ? 0.3 : 1,
              transition: 'all 0.3s ease',
              animation: !a.locked ? `fadeInUp 0.4s ease ${i * 0.1}s both` : 'none',
            }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: a.locked ? 'rgba(255,255,255,0.04)' : 'rgba(34,197,94,0.12)', border: `0.5px solid ${a.locked ? 'rgba(255,255,255,0.05)' : 'rgba(34,197,94,0.25)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {a.locked ? <Lock size={13} color="#2d4a32" /> : <a.icon size={14} color="#4ADE80" />}
              </div>
              <span style={{ fontSize: 9, color: '#86EFAC', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
              <span style={{ fontSize: 8, color: '#2d4a32', textAlign: 'center', lineHeight: 1.3 }}>{a.desc}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" onClick={onDrives}>
            <Users size={16} /> Join next drive
          </button>
          <button className="btn-ghost">
            <Share2 size={14} /> Share my plant
          </button>
        </div>
      </div>

      <style>{`
        @keyframes gentleSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(0.95); }
          50% { opacity: 1; transform: translateX(-50%) scale(1.05); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
