import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';
import { ArrowLeft, ArrowUp, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ReportsScreen({ onBack }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { loadReports(); }, []);

  const loadReports = async () => {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error(err);
      setError('Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (reportId) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { upvotes: increment(1) });
      loadReports(); // Refresh
    } catch (err) {
      alert("Could not upvote");
    }
  };

  const markAsResolved = async (reportId) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { status: 'Resolved' });
      loadReports();
    } catch (err) {
      alert("Could not update status");
    }
  };

  const markStillExists = async (reportId) => {
    try {
      const reportRef = doc(db, 'reports', reportId);
      await updateDoc(reportRef, { status: 'Open' });
      loadReports();
    } catch (err) {
      alert("Could not update");
    }
  };

  if (loading) return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={18} /></button>
        <div className="topbar-title">Community Reports</div>
      </div>
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-dim)' }}>Loading reports...</div>
    </div>
  );

  if (error) return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={18} /></button>
        <div className="topbar-title">Community Reports</div>
      </div>
      <div style={{ textAlign: 'center', padding: 40, color: '#ef5350' }}>{error}</div>
    </div>
  );

  return (
    <div className="screen">
      <div className="topbar">
        <button className="icon-btn" onClick={onBack}><ArrowLeft size={18} /></button>
        <div>
          <div className="topbar-title">Community Reports</div>
          <div className="topbar-sub">Help verify & validate issues</div>
        </div>
      </div>

      <div className="scroll">
        {reports.map(report => (
          <div key={report.id} className="glass-card" style={{ margin: '0 20px 14px' }}>
            {report.photo && (
              <img src={report.photo} alt="report" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
            )}

           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
  <span style={{ 
    fontSize: 12, 
    fontWeight: 450, 
    color: 'var(--text-primary)'   // This makes it bright white/greenish
  }}>
    {report.tag}
  </span>
  <span className={`tag ${report.severity === 'Mild' ? 'tag-green' : report.severity === 'Moderate' ? 'tag-orange' : 'tag-red'}`}>
    {report.severity}
  </span>
</div>

            {report.note && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>{report.note}</p>}

            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>
              📍 {report.location} • {report.createdAt?.toDate ? new Date(report.createdAt.toDate()).toLocaleString() : 'Just now'}
            </div>

            {/* AI Analysis */}
            {report.analysis && (
              <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 12, padding: 14, marginBottom: 12 }}>
                <div style={{ color: '#4ADE80', fontWeight: 600, marginBottom: 8 }}>🌱 Seed Agent</div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {report.analysis.summary || report.analysis.issueType}
                </div>
                {report.analysis.confidence && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <span>Confidence</span>
                      <span style={{ color: '#4ADE80' }}>{report.analysis.confidence}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, marginTop: 4 }}>
                      <div style={{ width: `${report.analysis.confidence}%`, height: '100%', background: '#4ADE80', borderRadius: 999 }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Community Validation Buttons */}
<div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
  <button 
    onClick={() => handleUpvote(report.id)}
    style={{ 
      flex: 1, 
      padding: '12px 14px', 
      background: '#1a2e20', 
      border: '1px solid #4ADE80', 
      borderRadius: 12, 
      color: '#4ADE80', 
      fontWeight: 600, 
      fontSize: 13,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 6,
      transition: 'all 0.2s ease'
    }}
    onMouseOver={(e) => { e.target.style.background = '#22C55E'; e.target.style.color = '#0B0F0C'; }}
    onMouseOut={(e) => { e.target.style.background = '#1a2e20'; e.target.style.color = '#4ADE80'; }}
  >
    <ArrowUp size={16} /> Upvote ({report.upvotes || 0})
  </button>

  <button 
    onClick={() => markStillExists(report.id)}
    style={{ 
      flex: 1, 
      padding: '12px 14px', 
      background: '#2c1f12', 
      border: '1px solid #fb923c', 
      borderRadius: 12, 
      color: '#fb923c', 
      fontWeight: 600, 
      fontSize: 13,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 6,
      transition: 'all 0.2s ease'
    }}
    onMouseOver={(e) => { e.target.style.background = '#fb923c'; e.target.style.color = '#0B0F0C'; }}
    onMouseOut={(e) => { e.target.style.background = '#2c1f12'; e.target.style.color = '#fb923c'; }}
  >
    <AlertTriangle size={16} /> Still Exists
  </button>

  <button 
    onClick={() => markAsResolved(report.id)}
    style={{ 
      flex: 1, 
      padding: '12px 14px', 
      background: '#1a2e20', 
      border: '1px solid #4ADE80', 
      borderRadius: 12, 
      color: '#4ADE80', 
      fontWeight: 600, 
      fontSize: 13,
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      gap: 6,
      transition: 'all 0.2s ease'
    }}
    onMouseOver={(e) => { e.target.style.background = '#4ADE80'; e.target.style.color = '#0B0F0C'; }}
    onMouseOut={(e) => { e.target.style.background = '#1a2e20'; e.target.style.color = '#4ADE80'; }}
  >
    <CheckCircle size={16} /> Resolved
  </button>
</div>
          </div>
        ))}
      </div>
    </div>
  );
}