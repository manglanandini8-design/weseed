
import { useState, useEffect } from 'react';
import { Bell, User, MapPin, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { GoogleMap, Marker, LoadScript, Circle, InfoWindow } from '@react-google-maps/api';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const MAP_DARK_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0d1a0f' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4ADE80' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0F0C' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a2e20' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#3d5c42' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#091409' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1a2e20' }] },
];

const MAP_OPTIONS = {
  disableDefaultUI: true,
  styles: MAP_DARK_STYLE,
  gestureHandling: 'greedy',
};

// Color by dominant severity in the hotspot
const severityToColor = (severity) => {
  if (severity === 'Severe' || severity === 'Critical') return '#ef4444';
  if (severity === 'Moderate') return '#f97316';
  return '#22C55E';
};

const getIssueUI = (tag) => {
  const t = tag?.toLowerCase() || '';
  if (t.includes('garbage')) return { icon: '🗑️', bg: 'rgba(239,68,68,0.15)', color: '#ef4444' };
  if (t.includes('litter'))  return { icon: '🚯', bg: 'rgba(251,146,60,0.15)',  color: '#f97316' };
  if (t.includes('dirty') || t.includes('water')) return { icon: '💧', bg: 'rgba(59,130,246,0.15)', color: '#3b82f6' };
  if (t.includes('pothole')) return { icon: '🕳️', bg: 'rgba(107,114,128,0.15)', color: '#6b7280' };
  return { icon: '📍', bg: 'rgba(34,197,94,0.15)', color: '#22C55E' };
};

const severityColor = (s) =>
  s === 'Severe' || s === 'Critical' ? '#ef4444' : s === 'Moderate' ? '#ffa726' : '#4ADE80';

export default function HomeScreen({ onReport, onViewReports, onViewHotspots }) {
  const [activeChip, setActiveChip]       = useState('All spots');
  const [location, setLocation]           = useState(null);
  const [reports, setReports]             = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [hotspots, setHotspots]           = useState([]);
  const [mapExpanded, setMapExpanded]     = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [mapsLoaded, setMapsLoaded]       = useState(false);

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
    } catch (err) { console.error(err); }
  };

  const calculateHotspots = (reports) => {
    const grouped = {};
    reports.forEach(r => {
      if (typeof r.latitude !== 'number' || typeof r.longitude !== 'number') return;
      const key = `${r.tag}-${r.latitude.toFixed(3)}-${r.longitude.toFixed(3)}`;
      if (!grouped[key]) grouped[key] = {
        center: { lat: r.latitude, lng: r.longitude },
        reports: [], issue: r.tag,
        totalLat: 0, totalLng: 0,
      };
      grouped[key].reports.push(r);
      grouped[key].totalLat += r.latitude;
      grouped[key].totalLng += r.longitude;
    });
    const result = Object.values(grouped).map(h => {
      // dominant severity = worst severity found in this cluster
      const order = { Critical: 4, Severe: 3, Moderate: 2, Mild: 1 };
      const dominant = h.reports.reduce((worst, r) =>
        (order[r.severity] || 0) > (order[worst] || 0) ? r.severity : worst
      , 'Mild');
      return {
        ...h,
        center: { lat: h.totalLat / h.reports.length, lng: h.totalLng / h.reports.length },
        dominant,
      };
    });
    setHotspots(result);
  };

  const filteredReports = reports.filter(r => {
    if (activeChip === 'All spots') return true;
    if (activeChip === 'Fixed') return r.status === 'Resolved';
    return r.tag?.toLowerCase().includes(activeChip.toLowerCase());
  });

  const mapHeight = mapExpanded ? 320 : 220;

  return (
    <div className="screen">
      {/* Topbar */}
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

        {/* ── MAP HERO ── */}
        <div style={{ margin: '0 20px 14px', borderRadius: 20, overflow: 'hidden', border: '0.5px solid rgba(34,197,94,0.2)', position: 'relative', transition: 'height 0.4s ease' }}>

          {/* Legend overlay */}
          <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 4, background: 'rgba(11,15,12,0.75)', borderRadius: 10, padding: '6px 8px', backdropFilter: 'blur(6px)', border: '0.5px solid rgba(34,197,94,0.15)' }}>
            {[['#ef4444','Severe'],['#f97316','Moderate'],['#22C55E','Mild']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                <span style={{ fontSize: 9, color: '#86EFAC' }}>{l}</span>
              </div>
            ))}
          </div>

          {/* Expand/collapse toggle */}
          <button
            onClick={() => setMapExpanded(e => !e)}
            style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 10, background: 'rgba(11,15,12,0.8)', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', backdropFilter: 'blur(6px)' }}>
            {mapExpanded
              ? <><ChevronUp size={11} color="#4ADE80" /><span style={{ fontSize: 9, color: '#4ADE80' }}>Collapse</span></>
              : <><ChevronDown size={11} color="#4ADE80" /><span style={{ fontSize: 9, color: '#4ADE80' }}>Expand</span></>}
          </button>

          {/* Hotspot count badge */}
          {hotspots.length > 0 && (
            <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10, background: 'rgba(11,15,12,0.8)', border: '0.5px solid rgba(239,68,68,0.4)', borderRadius: 20, padding: '3px 8px', backdropFilter: 'blur(6px)' }}>
              <span style={{ fontSize: 9, color: '#fca5a5', fontWeight: 600 }}>🔥 {hotspots.length} hotspot{hotspots.length !== 1 ? 's' : ''}</span>
            </div>
          )}

          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
            onLoad={() => setMapsLoaded(true)}
            onError={() => {}}
          >
            {location ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: mapHeight }}
                center={location}
                zoom={15}
                options={MAP_OPTIONS}
                onClick={() => setSelectedHotspot(null)}
              >
                {/* User location marker */}
                <Marker
                  position={location}
                  icon={{ path: 'M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0', fillColor: '#22C55E', fillOpacity: 1, strokeColor: '#fff', strokeWeight: 2, scale: 1.5 }}
                />

                {/* Severity-colored hotspot circles */}
                {hotspots.map((h, i) => {
                  const color = severityToColor(h.dominant);
                  const count = h.reports?.length || 1;
                  return (
                    <Circle
                      key={i}
                      center={h.center}
                      radius={60 + count * 25}
                      options={{
                        fillColor: color,
                        strokeColor: color,
                        fillOpacity: 0.22,
                        strokeWeight: 1.5,
                        strokeOpacity: 0.7,
                      }}
                      onClick={() => setSelectedHotspot(h)}
                    />
                  );
                })}

                {/* InfoWindow on hotspot click */}
                {selectedHotspot && (
                  <InfoWindow
                    position={selectedHotspot.center}
                    onCloseClick={() => setSelectedHotspot(null)}
                  >
                    <div style={{ background: '#0d1a0f', padding: '6px 8px', borderRadius: 8, minWidth: 120 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#0B0F0C', marginBottom: 2 }}>{selectedHotspot.issue}</div>
                      <div style={{ fontSize: 10, color: '#555' }}>{selectedHotspot.reports.length} report{selectedHotspot.reports.length !== 1 ? 's' : ''} · {selectedHotspot.dominant}</div>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            ) : (
              <div style={{ height: mapHeight, background: '#0d1f10', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'height 0.4s ease' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(34,197,94,0.3)', borderTopColor: '#22C55E', animation: 'spin 1s linear infinite' }} />
                <span style={{ fontSize: 11, color: '#3d5c42' }}>
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
          {filteredReports.length > 0
            ? `${filteredReports.length} spot${filteredReports.length !== 1 ? 's' : ''} reported near you`
            : 'No reports matching filter'}
        </div>

        {/* Report cards */}
        {filteredReports.map(report => {
          const issueUI = getIssueUI(report.tag);
          return (
            <div key={report.id} className="glass-card" style={{ margin: '0 20px 10px', cursor: 'pointer' }} onClick={onReport}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: issueUI.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                  {report.photo
                    ? <img src={report.photo} alt="" onError={e => { e.target.style.display = 'none' }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: 24 }}>{issueUI.icon}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.tag}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 3 }}>
                    📍 {report.location ? report.location.substring(0, 26) + '...' : 'Unknown'}
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

      {/* FAB */}
      <button onClick={onReport} style={{ position: 'absolute', bottom: 90, right: 20, width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 50, boxShadow: '0 4px 16px rgba(34,197,94,0.35)' }}>
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
}
