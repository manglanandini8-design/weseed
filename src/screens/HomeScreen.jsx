import { useState, useEffect } from 'react';
import { Bell, User, MapPin, Plus } from 'lucide-react';
import { GoogleMap, Marker, LoadScript, Circle } from '@react-google-maps/api';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const mapContainerStyle = { width: '100%', height: '180px' };

const MAP_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1a0f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4ADE80' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0F0C' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2e20' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#091409' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const MAP_OPTIONS = {
  disableDefaultUI: true,
  styles: MAP_DARK_STYLE,
};

export default function HomeScreen({ onReport, onViewReports, onViewHotspots }) {
  const [activeChip, setActiveChip] = useState('All spots');
  const [location, setLocation] = useState(null);
  const [reports, setReports] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [mapLoadError, setMapLoadError] = useState(false);

  const chips = ['All spots', 'Garbage', 'Littering', 'Dirty water', 'Fixed'];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => setLocation({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setLocationError(true)
    );
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setReports(data);
      calculateHotspots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateHotspots = (reports) => {
    const grouped = {};
    reports.forEach(r => {
      if (typeof r.latitude !== 'number' || typeof r.longitude !== 'number') return;
      const key = `${r.tag}-${r.latitude.toFixed(3)}-${r.longitude.toFixed(3)}`;
      if (!grouped[key]) grouped[key] = { center: { lat: r.latitude, lng: r.longitude }, reports: [], issue: r.tag, totalLat: 0, totalLng: 0 };
      grouped[key].reports.push(r);
      grouped[key].totalLat += r.latitude;
      grouped[key].totalLng += r.longitude;
    });
    Object.values(grouped).forEach(h => {
      h.center = { lat: h.totalLat / h.reports.length, lng: h.totalLng / h.reports.length };
    });
    setHotspots(Object.values(grouped));
  };

  const getIssueUI = (tag) => {
    const t = tag?.toLowerCase() || '';
    if (t.includes('garbage')) return { icon: '🗑️', bg: 'rgba(239,68,68,0.15)', color: '#ef4444' };
    if (t.includes('litter')) return { icon: '🚯', bg: 'rgba(251,146,60,0.15)', color: '#f97316' };
    if (t.includes('dirty') || t.includes('water')) return { icon: '💧', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' };
    if (t.includes('pothole')) return { icon: '🕳️', bg: 'rgba(107,114,128,0.15)', color: '#6b7280' };
    return { icon: '📍', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' };
  };

  const filteredReports = reports.filter(r => {
    if (activeChip === 'All spots') return true;
    if (activeChip === 'Fixed') return r.status === 'Resolved';
    return r.tag?.toLowerCase().includes(activeChip.toLowerCase());
  });

  const severityColor = (s) => s === 'Severe' ? '#ef4444' : s === 'Moderate' ? '#ffa726' : '#4ADE80';

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="topbar-title">WeSeed</div>
          <div className="topbar-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} color="#22C55E" />
            {locationError ? 'Location access denied' : location ? 'Current location active' : 'Detecting your location...'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="icon-btn"><Bell size={16} color="#4ADE80" /></button>
          <button className="icon-btn"><User size={16} color="#4ADE80" /></button>
        </div>
      </div>

      <div className="scroll">
        {/* Map */}
        <div style={{ margin: '0 20px 14px', borderRadius: 20, overflow: 'hidden', border: '0.5px solid rgba(34,197,94,0.12)' }}>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} onError={() => setMapLoadError(true)}>
            {mapLoadError ? (
              <div style={{ height: 180, background: '#0d1f10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <span style={{ fontSize: 24 }}>🗺️</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Map unavailable</span>
              </div>
            ) : location ? (
              <GoogleMap mapContainerStyle={mapContainerStyle} center={location} zoom={15} options={MAP_OPTIONS}>
                <Marker position={location} />
                {hotspots.map((h, i) => (
                  <Circle key={i} center={h.center} radius={80 + (h.reports?.length || 1) * 22}
                    options={{ fillColor: '#22C55E', strokeColor: '#22C55E', fillOpacity: 0.28, strokeWeight: 2 }}
                  />
                ))}
              </GoogleMap>
            ) : (
              <div style={{ height: 180, background: '#0d1f10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(34,197,94,0.3)', borderTopColor: '#22C55E', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
                  {locationError ? 'Enable location to see map' : 'Loading hotspot map...'}
                </span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}
          </LoadScript>
        </div>

        {/* Quick Actions */}
        <div style={{ margin: '0 20px 14px', display: 'flex', gap: 10 }}>
          <button onClick={onViewReports} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', background: '#22C55E', color: '#000', fontWeight: '600', fontSize: 13, cursor: 'pointer' }}>📄 Reports</button>
          <button onClick={onViewHotspots} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #22C55E', background: 'transparent', color: '#22C55E', fontWeight: '600', fontSize: 13, cursor: 'pointer' }}>🔥 Hotspots</button>
        </div>

        {/* Filters */}
        <div className="filter-row">
          {chips.map(c => (
            <button key={c} className={`chip ${activeChip === c ? 'active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
          ))}
        </div>

        {/* Section label */}
        <div className="sec-label">
          {filteredReports.length > 0 ? `${filteredReports.length} spot${filteredReports.length !== 1 ? 's' : ''} reported near you` : 'No reports matching filter'}
        </div>

        {/* Report cards */}
        {filteredReports.map(report => {
          const issueUI = getIssueUI(report.tag);
          return (
            <div key={report.id} className="glass-card" style={{ margin: '0 20px 10px', cursor: 'pointer' }} onClick={onReport}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: issueUI.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {report.photo ? (
                    <img src={report.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: 24 }}>{issueUI.icon}</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.tag}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4 }}>
                    📍 {report.location ? report.location.substring(0, 28) + '...' : 'Unknown'}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>
                    {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Just now'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: severityColor(report.severity), flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: severityColor(report.severity), fontWeight: 500 }}>{report.severity || 'Moderate'}</span>
                    {report.status === 'Resolved' && (
                      <span style={{ fontSize: 10, color: '#4ADE80', background: 'rgba(34,197,94,0.1)', borderRadius: 10, padding: '1px 7px' }}>Resolved</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ height: 20 }} />
      </div>

      <button onClick={onReport} style={{ position: 'absolute', bottom: 90, right: 20, width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 50, boxShadow: '0 4px 16px rgba(34,197,94,0.35)' }}>
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
}
