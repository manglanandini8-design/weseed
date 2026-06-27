import { Settings, Trophy, TrendingUp, MapPin, Users, Sparkles, Lock, Check, Leaf, Share2 } from 'lucide-react'
import PlantSVG from '../components/PlantSVG'
import { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const stages = [
  { label: 'Seed', state: 'done' },
  { label: 'Sprout', state: 'done' },
  { label: 'Plant', state: 'done' },
  { label: 'Flower', state: 'active' },
  { label: 'Tree', state: 'locked' },
]

const achievements = [
  { label: 'First Report', icon: MapPin, locked: false },
  { label: 'First Drive', icon: Users, locked: false },
  { label: 'Community Builder', icon: Trophy, locked: false },
  { label: 'Env. Guardian', icon: Leaf, locked: true },
  { label: 'Green Champion', icon: Sparkles, locked: true },
]

const impactCards = [
  { icon: MapPin, num: 14, label: 'Spots reported', trend: '+3 this week' },
  { icon: Users, num: 7, label: 'Drives joined', trend: '+1 this week' },
  { icon: Sparkles, num: 5, label: 'Areas improved', trend: '+2 this month' },
  { icon: Trophy, num: 420, label: 'Impact points', trend: 'Top 10% city' },
]

export default function PlantScreen({ onDrives }) {
  const [stats, setStats] = useState({
    totalReports: 0,
    resolved: 0,
    pending: 0,
    hotspots: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));
      const reports = snapshot.docs.map(doc => doc.data());

      const total = reports.length;
      const resolved = reports.filter(r => r.status === 'Resolved').length;
      const pending = total - resolved;
      const hotspots = new Set(reports.map(r => `${Math.round(r.latitude)},${Math.round(r.longitude)}`)).size;

      setStats({ totalReports: total, resolved, pending, hotspots });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="screen">
      <div className="scroll">
        {/* Profile top - Original */}
        <div style={{ padding: '8px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #22C55E, #166534)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 500, color: '#fff', border: '2px solid #22C55E' }}>RS</div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#22C55E', border: '2px solid #0B0F0C' }} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>Rajveer Singh</div>
              <div style={{ display: 'flex', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '2px 7px', fontSize: 9, color: '#4ADE80', fontWeight: 500 }}>
                  <Trophy size={8} /> Rank #12
                </span>
                <span style={{ background: 'rgba(134,239,172,0.08)', border: '0.5px solid rgba(134,239,172,0.2)', borderRadius: 20, padding: '2px 8px', fontSize: 9, color: '#86EFAC' }}>Flowering Plant</span>
              </div>
            </div>
          </div>
          <button style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Settings size={15} color="var(--text-dim)" />
          </button>
        </div>

        {/* Hero plant with animations */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 0 0' }}>
          <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,197,94,0.22) 0%, transparent 70%)', animation: 'pulseGlow 4s ease-in-out infinite' }} />
          <PlantSVG size={170} style={{ animation: 'gentleSway 6s ease-in-out infinite' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '4px 10px', fontSize: 10, color: '#4ADE80', marginTop: 8, zIndex: 2 }}>
            <span className="pulse-dot" />
            Thriving · Last active 3 days ago
          </div>
        </div>

        {/* XP bar with animation */}
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: '#86EFAC', fontWeight: 500 }}>72% to Full Tree</span>
            <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>420 / 580 XP</span>
          </div>
          <div style={{ width: '100%', height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: '72%', 
              background: 'linear-gradient(90deg, #16a34a, #4ADE80)', 
              borderRadius: 10,
              animation: 'growProgress 1.8s ease-out'
            }} />
          </div>
          <div style={{ fontSize: 10, color: '#2d4a32', marginTop: 4 }}>78 XP until Full Tree — join a drive to get there</div>
        </div>

        {/* Impact Dashboard Section */}
        <div style={{ padding: '20px 20px 10px' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#4ADE80', marginBottom: 12 }}>Community Impact</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#4ADE80' }}>{stats.totalReports}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Total Reports</div>
            </div>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#4ADE80' }}>{stats.resolved}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Resolved</div>
            </div>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#4ADE80' }}>{stats.hotspots}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Hotspots</div>
            </div>
            <div className="glass-card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#4ADE80' }}>{stats.pending}</div>
              <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Pending</div>
            </div>
          </div>
        </div>

        {/* Original Timeline */}
        <div style={{ padding: '14px 20px 0' }}>
          <div style={{ fontSize: 10, color: '#2d4a32', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, fontWeight: 500 }}>Growth journey</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 13, left: 14, right: 14, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: 13, left: 14, height: 1, width: '55%', background: 'linear-gradient(90deg, #22C55E, #4ADE80)' }} />
            {stages.map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, zIndex: 2, position: 'relative' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: s.state === 'done' ? '#22C55E' : s.state === 'active' ? '#0B0F0C' : 'rgba(255,255,255,0.04)', border: s.state === 'active' ? '2px solid #4ADE80' : s.state === 'locked' ? '0.5px solid rgba(255,255,255,0.08)' : 'none', boxShadow: s.state === 'active' ? '0 0 8px rgba(74,222,128,0.4)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.state === 'done' && <Check size={11} color="#0B0F0C" />}
                  {s.state === 'active' && <Leaf size={11} color="#4ADE80" />}
                  {s.state === 'locked' && <Lock size={10} color="#2d4a32" />}
                </div>
                <span style={{ fontSize: 9, color: s.state === 'done' ? '#4ADE80' : s.state === 'active' ? '#86EFAC' : '#2d4a32' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Original Impact cards */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 8px' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4ADE80' }}>Impact</span>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', cursor: 'pointer' }}>this month</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 20px' }}>
          {impactCards.map(c => (
            <div key={c.label} className="glass-card" style={{ padding: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 7 }}>
                <c.icon size={14} color="#4ADE80" />
              </div>
              <div style={{ fontSize: 20, fontWeight: 500, color: 'var(--text-primary)' }}>{c.num}</div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', fontWeight: 500 }}>{c.label}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 9, color: '#22C55E', marginTop: 3 }}>
                <TrendingUp size={9} /> {c.trend}
              </div>
            </div>
          ))}
        </div>

        {/* Original Achievements */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px 8px' }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#4ADE80' }}>Achievements</span>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', cursor: 'pointer' }}>see all</span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 20px 4px' }}>
          {achievements.map(a => (
            <div key={a.label} className="glass-card" style={{ flexShrink: 0, width: 82, padding: '10px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, opacity: a.locked ? 0.25 : 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <a.icon size={15} color="#4ADE80" />
              </div>
              <span style={{ fontSize: 9, color: '#86EFAC', fontWeight: 500, textAlign: 'center', lineHeight: 1.3 }}>{a.label}</span>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn-primary" onClick={onDrives}>
            <Users size={16} /> Join next drive
          </button>
          <button className="btn-ghost">
            <Share2 size={14} /> Share my plant
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes gentleSway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes growProgress {
          from { width: 0%; }
          to { width: 72%; }
        }
      `}</style>
    </div>
  );
}