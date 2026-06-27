import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase'
import { ArrowLeft } from 'lucide-react'

export default function ReportsScreen({ onBack }) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { loadReports() }, [])

  const loadReports = async () => {
    try {
      const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      setReports(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    } catch (err) {
      console.error(err)
      setError('Failed to load reports. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="screen">
    <div className="topbar">
  <button className="icon-btn" onClick={onBack}>
    <ArrowLeft size={18} />
  </button>

  <div>
    <div className="topbar-title">Community Reports</div>
  </div>
</div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70%', color: 'var(--text-dim)' }}>
        🌱 Loading reports...
      </div>
    </div>
  )

  if (error) return (
    <div className="screen">
      <div className="topbar"> <button
        className="icon-btn"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
      </button><div className="topbar-title">Community Reports</div></div>
      <div style={{ textAlign: 'center', padding: 40, color: '#ef5350', fontSize: 13 }}>{error}</div>
    </div>
  )

  return (
    <div className="screen">
      <div className="topbar">
         <button
    className="icon-btn"
    onClick={onBack}
  >
    <ArrowLeft size={18} />
  </button>
        <div>
          <div className="topbar-title">Community Reports</div>
          <div className="topbar-sub">Live reports from citizens nearby</div>
        </div>
      </div>

      <div className="scroll">
        {reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🌱</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>No reports yet</div>
            <div style={{ fontSize: 12 }}>Be the first to report an issue in your community.</div>
          </div>
        ) : (
          reports.map(report => (
            <div key={report.id} className="glass-card" style={{ margin: '0 20px 14px' }}>

              {report.photo && (
                <img src={report.photo} alt="report" style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 10 }} />
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{report.tag}</span>
                <span className={`tag ${report.severity === 'Mild' ? 'tag-green' : report.severity === 'Moderate' ? 'tag-orange' : 'tag-red'}`}>
                  {report.severity}
                </span>
              </div>

              {report.note && (
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, lineHeight: 1.5 }}>{report.note}</p>
              )}

              <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
                📍 {report.location || 'Unknown location'} &nbsp;·&nbsp;
                {report.createdAt?.toDate
                  ? new Date(report.createdAt.toDate()).toLocaleString()
                  : 'Just now'}
              </div>

              {report.analysis && (
                <div style={{ background: 'rgba(34,197,94,0.05)', border: '0.5px solid rgba(34,197,94,0.15)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: '#4ADE80', fontWeight: 600, marginBottom: 6 }}>🌱 Seed Agent Analysis</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    <div><strong>Issue:</strong> {report.analysis.issueType}</div>
                    <div><strong>Risk:</strong> {report.analysis.risk}</div>
                    <div><strong>Authority:</strong> {report.analysis.department}</div>
                    {report.analysis.action && <div><strong>Action:</strong> {report.analysis.action}</div>}
                    <div><strong>Confidence:</strong> {report.analysis.confidence}</div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ▲ {report.upvotes || 0} upvotes
                </button>
                <span style={{ fontSize: 10, background: report.status === 'Resolved' ? 'rgba(34,197,94,0.12)' : 'rgba(251,140,0,0.12)', color: report.status === 'Resolved' ? '#4ADE80' : '#ffa726', padding: '3px 10px', borderRadius: 10, fontWeight: 500 }}>
                  {report.status || 'Open'}
                </span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}