import { useState, useEffect } from 'react'
import { Bell, User, MapPin, ArrowUp, Heart, Plus } from 'lucide-react'
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

const spots = [
  {
    id: 1, name: 'Model Town Park Gate',
    meta: '200m · 2 hrs ago',
    tags: [{ label: 'Garbage', cls: 'tag-red' }, { label: 'Littering', cls: 'tag-orange' }],
    upvotes: 24, drive: '1 drive planned', iconBg: 'rgba(229,57,53,0.12)', iconColor: '#ef5350', type: 'trash'
  },
  {
    id: 2, name: 'Sector 32 Bus Stand',
    meta: '450m · 5 hrs ago',
    tags: [{ label: 'Littering', cls: 'tag-orange' }],
    upvotes: 11, drive: 'Be first to plan', iconBg: 'rgba(251,140,0,0.1)', iconColor: '#ffa726', type: 'alert'
  },
  {
    id: 3, name: 'Civil Lines Garden',
    meta: '800m · Fixed yesterday',
    tags: [{ label: 'Cleaned ✓', cls: 'tag-green' }],
    upvotes: 38, drive: 'See before/after', iconBg: 'rgba(34,197,94,0.1)', iconColor: '#4ADE80', type: 'check', heart: true
  },
]
const mapContainerStyle = {
  width: '100%',
  height: '180px'
}
export default function HomeScreen({ onReport ,onViewReports }) {
  const [activeChip, setActiveChip] = useState('All spots')
  const [location, setLocation] = useState(null)
  const [reports, setReports] = useState([])
  const [locationError, setLocationError] = useState(false)
  const chips = ['All spots', 'Garbage', 'Littering', 'Dirty water', 'Fixed']
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        console.error(error)
        setLocationError(true)
      }
    )
     loadReports();
  }, [])
  const loadReports = async () => {
  try {
    const snapshot = await getDocs(collection(db, "reports"));

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReports(data);
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div className="screen">
      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">WeSeed</div>
          <div className="topbar-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} color="#22C55E" />
            {
              locationError
                ? "Location access denied"
                : location
                  ? "Current location available"
                  : "Detecting location..."
            }
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="icon-btn"><Bell size={16} color="#4ADE80" /></button>
          <button className="icon-btn"><User size={16} color="#4ADE80" /></button>
        </div>
      </div>

      <div className="scroll">
        {/* Map */}
        <div
          style={{
            margin: '0 20px 14px',
            borderRadius: 20,
            overflow: 'hidden'
          }}
        >
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            {location && (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{
                  lat: location.lat,
                  lng: location.lng
                }}
                zoom={15}
              >
                <Marker
                  position={{
                    lat: location.lat,
                    lng: location.lng
                  }}
                />
                {reports.map(report => (
                <Marker
                  key={report.id}
                  position={{
                    lat: report.latitude,
                    lng: report.longitude
                  }}
                />
))}
              </GoogleMap>
            )}
          </LoadScript>
        </div>
       
{/* Buttons */}
<div
  style={{
    margin: "0 20px 14px",
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
  }}
>

  <button
   onClick={onViewReports}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "12px",
      border: "none",
      background: "#22C55E",
      color: "#fff",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    📄 View Reports
  </button>

  <button
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "12px",
      border: "1px solid #22C55E",
      background: "transparent",
      color: "#22C55E",
      fontWeight: "600",
      cursor: "pointer",
    }}
  >
    🔥 Hotspots
  </button>
</div>

        {/* Filter chips */}
        <div className="filter-row">
          {chips.map(c => (
            <button key={c} className={`chip ${activeChip === c ? 'active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
          ))}
        </div>

        <div className="sec-label">
          {spots.length} spots near you
        </div>

        {/* Spot cards */}
        {spots.map(spot => (
          <div key={spot.id} className="glass-card" style={{ margin: '0 20px 10px', cursor: 'pointer' }} onClick={onReport}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ width: 50, height: 50, borderRadius: 12, background: spot.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {spot.type === 'trash' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={spot.iconColor} strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" /></svg>}
                {spot.type === 'alert' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={spot.iconColor} strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>}
                {spot.type === 'check' && <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={spot.iconColor} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{spot.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 5 }}>{spot.meta}</div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
                  {spot.tags.map(t => <span key={t.label} className={`tag ${t.cls}`}>{t.label}</span>)}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {spot.heart ? <Heart size={11} /> : <ArrowUp size={11} />} {spot.upvotes}
                  </button>
                  <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.1)', color: '#4ADE80', padding: '2px 8px', borderRadius: 10 }}>{spot.drive}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

            {/* FAB */}
      <button
        onClick={onReport}
        style={{
          position: 'absolute',
          bottom: 90,
          right: 20,
          width: 50,
          height: 50,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #16a34a, #22C55E)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          cursor: 'pointer',
          zIndex: 50,
          boxShadow: '0 4px 20px rgba(34,197,94,0.3)'
        }}
      >
        <Plus size={24} color="#fff" />
      </button>

    </div>
  )
}
