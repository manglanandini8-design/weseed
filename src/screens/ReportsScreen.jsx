import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, ArrowUp, CheckCircle, AlertTriangle } from 'lucide-react';

const SeverityColors = {
  Mild: { bg: 'rgba(34,197,94,0.12)', color: '#4ADE80', border: 'rgba(34,197,94,0.25)' },
  Moderate: { bg: 'rgba(251,140,0,0.12)', color: '#ffa726', border: 'rgba(251,140,0,0.25)' },
  Severe: { bg: 'rgba(229,57,53,0.12)', color: '#ef5350', border: 'rgba(229,57,53,0.25)' },
};

function ConfidenceBar({ value }) {
  const pct = typeof value === 'number' ? value : parseInt(value) || 0;
  const color = pct >= 80 ? '#4ADE80' : pct >= 60 ? '#fbbf24' : '#f97316';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4, color: 'var(--text-dim)' }}>
        <span>Confidence</span>
        <span style={{ color, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function ValidationButton({ onClick, color, borderColor, bg, icon, label, loading }) {
  const [pressed, setPressed] = useState(false);
  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 300);
    onClick();
  };
  return (
    <button onClick={handleClick} style={{
      flex: 1, padding: '10px 8px',
      background: pressed ? color : bg,
      border: `1px solid ${borderColor}`,
      borderRadius: 12, color: pressed ? '#0B0F0C' : color,
      fontWeight: 600, fontSize: 12,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
      transition: 'all 0.2s ease', cursor: 'pointer',
      transform: pressed ? 'scale(0.96)' : 'scale(1)',
    }}>
      {icon} {label}
    </button>
  );
}

function ReportCard({ report, onUpvote, onStillExists, onResolved }) {
  const sev = SeverityColors[report.severity] || SeverityColors.Moderate;
  const ai = report.analysis;

  return (
    <div className="glass-card" style={{ margin: '0 20px 16px', padding: 0, overflow: 'hidden' }}>
      {/* Photo */}
      {report.photo && (
        <img src={report.photo} alt="report" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
      )}

      <div style={{ padding: '14px 14px 10px' }}>
        {/* Title + Severity */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {report.tag}
          </div>
          <span style={{
            padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 600, flexShrink: 0,
            background: sev.bg, border: `0.5px solid ${sev.border}`, color: sev.color,
          }}>{report.severity}</span>
        </div>

        {/* Location + Date */}
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: report.note ? 8 : 10 }}>
          📍 {report.location} · {report.createdAt?.toDate ? new Date(report.createdAt.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
        </div>

        {/* Note */}
        {report.note && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, lineHeight: 1.5 }}>{report.note}</p>
        )}

        {/* Status badge */}
        {report.status === 'Resolved' && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.1)', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '3px 10px', fontSize: 10, color: '#4ADE80', fontWeight: 600, marginBottom: 10 }}>
            <CheckCircle size={10} /> Resolved
          </div>
        )}
      </div>

      {/* AI Analysis */}
      {ai && (
        <div style={{ margin: '0 14px 12px', borderRadius: 12, background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.2)', overflow: 'hidden' }}>
          {/* AI Header */}
          <div style={{ padding: '10px 12px 8px', borderBottom: '0.5px solid rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13 }}>🌱</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#4ADE80' }}>Seed Agent</span>
          </div>

          <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Issue row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{ai.issueType}</span>
              {ai.urgency && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(251,191,36,0.1)', border: '0.5px solid rgba(251,191,36,0.25)', color: '#fbbf24', fontWeight: 500 }}>
                  ⚡ {ai.urgency}
                </span>
              )}
            </div>

            {/* Confidence bar */}
            {ai.confidence && <ConfidenceBar value={ai.confidence} />}

            {/* Tags */}
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {ai.department && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(99,102,241,0.1)', border: '0.5px solid rgba(99,102,241,0.25)', color: '#a5b4fc' }}>
                  🏛 {ai.department}
                </span>
              )}
              {ai.healthHazard && ai.healthHazard !== 'None' && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(239,68,68,0.08)', border: '0.5px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                  🏥 {ai.healthHazard} risk
                </span>
              )}
            </div>

            {/* Risk */}
            {ai.risk && (
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5, borderLeft: '2px solid rgba(251,140,0,0.4)', paddingLeft: 8 }}>
                {ai.risk}
              </div>
            )}

            {/* Action */}
            {ai.suggestedAction && (
              <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>→ {ai.suggestedAction}</div>
            )}

            {/* Summary */}
            {ai.summary && (
              <div style={{ padding: '8px 10px', borderRadius: 8, background: 'rgba(34,197,94,0.06)', border: '0.5px solid rgba(34,197,94,0.15)', fontSize: 11, color: '#86EFAC', lineHeight: 1.5 }}>
                {ai.summary}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Validation */}
      <div style={{ padding: '0 14px 14px', display: 'flex', gap: 6 }}>
        <ValidationButton
          onClick={() => onUpvote(report.id)}
          color="#4ADE80" borderColor="#4ADE80" bg="#1a2e20"
          icon={<><ArrowUp size={13} /> {report.upvotes || 0}</>}
          label="Upvote"
        />
        <ValidationButton
          onClick={() => onStillExists(report.id)}
          color="#fb923c" borderColor="#fb923c" bg="#2c1f12"
          icon={<AlertTriangle size={13} />}
          label="Still here"
        />
        <ValidationButton
          onClick={() => onResolved(report.id)}
          color="#4ADE80" borderColor="#22C55E" bg="#132013"
          icon={<CheckCircle size={13} />}
          label="Resolved"
        />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card" style={{ margin: '0 20px 16px' }}>
      {[90, 60, 40].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 14 : 10, background: 'rgba(255,255,255,0.05)', borderRadius: 6, marginBottom: 10, width: `${w}%`, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

export default function ReportsScreen({ onBack }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => { loadReports(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const loadReports = async () => {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setReports(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (id) => {
    await updateDoc(doc(db, 'reports', id), { upvotes: increment(1) });
    showToast('👍 Upvoted!');
    loadReports();
  };

  const markStillExists = async (id) => {
    await updateDoc(doc(db, 'reports', id), { status: 'Open' });
    showToast('⚠ Marked as still existing');
    loadReports();
  };

  const markAsResolved = async (id) => {
    await updateDoc(doc(db, 'reports', id), { status: 'Resolved' });
    showToast('✅ Marked as resolved');
    loadReports();
  };

  return (
    <div className="screen">
      {toast && (
        <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: '#1a2e20', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '10px 18px', fontSize: 12, color: '#4ADE80', zIndex: 999, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      <div className="topbar">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={18} /></button>
        <div>
          <div className="topbar-title">Community Reports</div>
          <div className="topbar-sub">Help verify & validate issues</div>
        </div>
      </div>

      <div className="scroll" style={{ paddingTop: 8 }}>
        {loading ? (
          <>{[1,2,3].map(i => <SkeletonCard key={i} />)}</>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#ef5350' }}>{error}</div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-dim)' }}>No reports yet. Be the first to report!</div>
        ) : (
          reports.map(report => (
            <ReportCard
              key={report.id} report={report}
              onUpvote={handleUpvote} onStillExists={markStillExists} onResolved={markAsResolved}
            />
          ))
        )}
      </div>
    </div>
  );
}
