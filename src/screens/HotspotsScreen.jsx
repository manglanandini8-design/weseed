import { ArrowLeft, Users, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function HotspotsScreen({ onBack }) {
  const [hotspots, setHotspots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotspots();
  }, []);

  const loadHotspots = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));
      const reports = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const grouped = {};

      reports.forEach(report => {
        if (!report.latitude || !report.longitude) return;

        const key = `${report.tag}-${Math.round(report.latitude * 100)}-${Math.round(report.longitude * 100)}`;
        
        if (!grouped[key]) {
          grouped[key] = {
            location: report.location || "Unknown Area",
            count: 0,
            issue: report.tag,
            severity: report.severity,
            reports: [],
            avgLat: 0,
            avgLng: 0
          };
        }
        grouped[key].count++;
        grouped[key].reports.push(report);
        grouped[key].avgLat += report.latitude;
        grouped[key].avgLng += report.longitude;
      });

      const result = Object.values(grouped)
        .map(h => ({
          ...h,
          avgLat: h.avgLat / h.count,
          avgLng: h.avgLng / h.count,
          intensity: Math.min(100, h.count * 15 + (h.severity === 'Severe' ? 30 : 0))
        }))
        .sort((a, b) => b.count - a.count);

      setHotspots(result);
    } finally {
      setLoading(false);
    }
  };

  const getIssueColor = (issue) => {
    if (issue?.toLowerCase().includes('garbage')) return '#ef4444';
    if (issue?.toLowerCase().includes('dirty')) return '#3b82f6';
    if (issue?.toLowerCase().includes('pothole')) return '#6b7280';
    return '#eab308';
  };

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <div className="topbar-title">Hotspots</div>
          <div className="topbar-sub">Live community pain points</div>
        </div>
      </div>

      <div className="scroll" style={{ padding: '0 20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            Mapping community signals...
          </div>
        ) : (
          hotspots.map((hotspot, index) => (
            <div key={index} className="glass-card" style={{ marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {hotspot.location}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 2 }}>
                      {hotspot.issue}
                    </div>
                  </div>
                  <div style={{ 
                    background: getIssueColor(hotspot.issue) + '22', 
                    color: getIssueColor(hotspot.issue),
                    padding: '4px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                    {hotspot.count} reports
                  </div>
                </div>

                <div style={{ marginTop: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${hotspot.intensity}%`, 
                      height: '100%', 
                      background: `linear-gradient(to right, ${getIssueColor(hotspot.issue)}, #22C55E)` 
                    }} />
                  </div>
                  <Flame size={14} color={getIssueColor(hotspot.issue)} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}