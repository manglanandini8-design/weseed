import { useState, useEffect } from 'react';
import { Bell, User, MapPin, Plus } from 'lucide-react';
import { GoogleMap, Marker, LoadScript, Circle, InfoWindow } from '@react-google-maps/api';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const mapContainerStyle = {
  width: '100%',
  height: '180px'
};

export default function HomeScreen({ onReport, onViewReports, onViewHotspots }) {
  const [activeChip, setActiveChip] = useState('All spots');
  const [location, setLocation] = useState(null);
  const [reports, setReports] = useState([]);
  const [locationError, setLocationError] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  const chips = ['All spots', 'Garbage', 'Littering', 'Dirty water', 'Fixed'];

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error(error);
        setLocationError(true);
      }
    );
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReports(data);
      calculateHotspots(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getIssueUI = (tag) => {
    const issue = tag?.toLowerCase() || "";

    if (issue.includes("garbage")) 
      return { icon: "🗑️", bg: "rgba(239,68,68,0.15)" };

    if (issue.includes("litter")) 
      return { icon: "🚯", bg: "rgba(251,146,60,0.15)" };

    if (issue.includes("dirty") || issue.includes("water")) 
      return { icon: "💧", bg: "rgba(59,130,246,0.15)" };

    if (issue.includes("pothole")) 
      return { icon: "🕳️", bg: "rgba(107,114,128,0.15)" };

    return { icon: "📍", bg: "rgba(34,197,94,0.15)" };
  };

  const calculateHotspots = (reports) => {
    const grouped = {};

    reports.forEach(report => {
      if (typeof report.latitude !== "number" || typeof report.longitude !== "number") return;

      const lat = report.latitude.toFixed(3);
      const lng = report.longitude.toFixed(3);
      const issue = report.tag || "Unknown";
      const key = `${issue}-${lat}-${lng}`;

      if (!grouped[key]) {
        grouped[key] = {
          center: { lat: report.latitude, lng: report.longitude },
          totalLat: 0,
          totalLng: 0,
          issue: issue,
          reports: [],
        };
      }

      grouped[key].reports.push(report);
      grouped[key].totalLat += report.latitude;
      grouped[key].totalLng += report.longitude;
    });

    Object.values(grouped).forEach(hotspot => {
      if (hotspot.reports.length > 0) {
        hotspot.center = {
          lat: hotspot.totalLat / hotspot.reports.length,
          lng: hotspot.totalLng / hotspot.reports.length,
        };
      }
    });

    setHotspots(Object.values(grouped));
  };

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="topbar-title">WeSeed</div>
          <div className="topbar-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} color="#22C55E" />
            {locationError ? "Location access denied" : location ? "Current location available" : "Detecting location..."}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="icon-btn"><Bell size={16} color="#4ADE80" /></button>
          <button className="icon-btn"><User size={16} color="#4ADE80" /></button>
        </div>
      </div>

      <div className="scroll">
        <div style={{ margin: '0 20px 14px', borderRadius: 20, overflow: 'hidden' }}>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} key="google-map-script">
            {location ? (
              <GoogleMap mapContainerStyle={mapContainerStyle} center={location} zoom={15}>
                <Marker position={location} />

                {hotspots.map((hotspot, index) => {
                  const hotspotColor = "#22C55E";
                  return (
                    <Circle 
                      key={`circle-${index}`} 
                      center={hotspot.center} 
                      radius={80 + (hotspot.reports?.length || 1) * 22} 
                      options={{ fillColor: hotspotColor, strokeColor: hotspotColor, fillOpacity: 0.32, strokeWeight: 3 }} 
                      onClick={() => setSelectedHotspot(hotspot)} 
                    />
                  );
                })}
              </GoogleMap>
            ) : (
              <div style={{ height: 180, background: '#0d1f10', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>
                Loading map...
              </div>
            )}
          </LoadScript>
        </div>

        <div style={{ margin: "0 20px 14px", display: "flex", gap: 10 }}>
          <button onClick={onViewReports} style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "none", background: "#22C55E", color: "#fff", fontWeight: "600" }}>📄 View Reports</button>
          <button onClick={onViewHotspots} style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "1px solid #22C55E", background: "transparent", color: "#22C55E", fontWeight: "600" }}>🔥 Hotspots</button>
        </div>

        <div className="sec-label">
          {reports.length > 0 ? `${reports.length} spots reported near you` : 'No reports yet — be the first!'}
        </div>

        {reports.map(report => {
          const issueUI = getIssueUI(report.tag);
          return (
            <div key={report.id} className="glass-card" style={{ margin: '0 20px 10px', cursor: 'pointer' }} onClick={onReport}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 14,
                  background: issueUI.bg,
                  display: "flex", justifyContent: "center", alignItems: "center",
                  overflow: "hidden", flexShrink: 0, fontSize: 36
                }}>
                  {report.photo ? (
                    <img src={report.photo} alt="report" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span>{issueUI.icon}</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {report.tag}
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-dim)', marginBottom: 8 }}>
                    {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleString() : "Just now"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={onReport} style={{ position: 'absolute', bottom: 90, right: 20, width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #16a34a, #22C55E)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', zIndex: 50 }}>
        <Plus size={24} color="#fff" />
      </button>
    </div>
  );
}