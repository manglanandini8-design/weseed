import { ArrowLeft, Flame, MapPin, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const issueColor = (issue) => {
  const t = issue?.toLowerCase() || '';
  if (t.includes('garbage') || t.includes('dump')) return '#ef4444';
  if (t.includes('dirty') || t.includes('water')) return '#3b82f6';
  if (t.includes('pothole')) return '#6b7280';
  if (t.includes('litter')) return '#f97316';
  if (t.includes('burn')) return '#f59e0b';
  return '#eab308';
};

const issueIcon = (issue) => {
  const t = issue?.toLowerCase() || '';
  if (t.includes('garbage')) return '🗑️';
  if (t.includes('water')) return '💧';
  if (t.includes('pothole')) return '🕳️';
  if (t.includes('litter')) return '🚯';
  if (t.includes('burn')) return '🔥';
  return '📍';
};

const severityBadge = (sev) => {
  if (sev === 'Severe' || sev === 'Critical') return { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' };
  if (sev === 'Moderate') return { color: '#ffa726', bg: 'rgba(255,167,38,0.12)', border: 'rgba(255,167,38,0.25)' };
  return { color: '#4ADE80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' };
};

function SkeletonCard() {
  return (
    <div className="glass-card" style={{ marginBottom: 12 }}>
      {[70, 45, 85].map((w, i) => (
        <div key={i} style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 6, marginBottom: 8, width: `${w}%`, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

export default function HotspotsScreen({ onBack }) {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadHotspots(); }, []);

  const loadHotspots = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));
      const reports = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      const grouped = {};
      reports.forEach(r => {
        if (!r.latitude || !r.longitude) return;
        const key = `${r.tag}-${Math.round(r.latitude * 100)}-${Math.round(r.longitude * 100)}`;
        if (!grouped[key]) {
          grouped[key] = { location: r.location || 'Unknown Area', count: 0, issue: r.tag, severity: r.severity, reports: [], avgLat: 0, avgLng: 0 };
        }
        grouped[key].count++;
        grouped[key].reports.push(r);
        grouped[key].avgLat += r.latitude;
        grouped[key].avgLng += r.longitude;
      });

      const result = Object.values(grouped).map(h => ({
        ...h,
        avgLat: h.avgLat / h.count,
        avgLng: h.avgLng / h.count,
        intensity: Math.min(100, h.count * 20 + (h.severity === 'Severe' ? 30 : h.severity === 'Moderate' ? 15 : 0)),
        dominantSeverity: h.reports.reduce((acc, r) => {
          const order = { Critical: 4, Severe: 3, Moderate: 2, Mild: 1 };
          return (order[r.severity] || 0) > (order[acc] || 0) ? r.severity : acc;
        }, 'Mild'),
      })).sort((a, b) => b.intensity - a.intensity);

      setHotspots(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={18} /></button>
        <div>
          <div className="topbar-title">Hotspots</div>
          <div className="topbar-sub">Live community pain points</div>
        </div>
        {!loading && (
          <div style={{ fontSize: 10, color: '#4ADE80', background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.25)', borderRadius: 20, padding: '4px 10px' }}>
            {hotspots.length} active
          </div>
        )}
      </div>

      <div className="scroll" style={{ padding: '8px 20px' }}>
        {loading ? (
          <>{[1,2,3].map(i => <SkeletonCard key={i} />)}</>
        ) : hotspots.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div>
            No hotspots detected yet
          </div>
        ) : (
          hotspots.map((hotspot, index) => {
            const color = issueColor(hotspot.issue);
            const sev = severityBadge(hotspot.dominantSeverity);
            return (
              <div key={index} className="glass-card" style={{ marginBottom: 12, overflow: 'hidden', padding: 0 }}>
                {/* Heat indicator line */}
                <div style={{ height: 3, background: `linear-gradient(to right, ${color}, transparent)`, width: `${hotspot.intensity}%`, borderRadius: '4px 0 0 0' }} />

                <div style={{ padding: '12px 14px' }}>
                  {/* Top row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 18 }}>{issueIcon(hotspot.issue)}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{hotspot.issue}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={9} /> {hotspot.location}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}18`, border: `0.5px solid ${color}40`, padding: '2px 8px', borderRadius: 20 }}>
                        {hotspot.count} {hotspot.count === 1 ? 'report' : 'reports'}
                      </span>
                      <span style={{ fontSize: 10, fontWeight: 500, color: sev.color, background: sev.bg, border: `0.5px solid ${sev.border}`, padding: '2px 7px', borderRadius: 20 }}>
                        {hotspot.dominantSeverity}
                      </span>
                    </div>
                  </div>

                  {/* Intensity bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-dim)', marginBottom: 5 }}>
                      <span>Severity intensity</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Flame size={10} color={color} />
                        <span style={{ color }}>{hotspot.intensity}%</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        width: `${hotspot.intensity}%`, height: '100%', borderRadius: 999,
                        background: `linear-gradient(to right, ${color}88, ${color})`,
                        transition: 'width 0.8s ease-out',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
