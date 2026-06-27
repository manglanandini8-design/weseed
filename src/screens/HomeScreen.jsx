// import { useState, useEffect } from 'react'
// import { Bell, User, MapPin, ArrowUp, Heart, Plus } from 'lucide-react'
// import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api'
// import { collection, getDocs } from "firebase/firestore"
// import { db } from "../firebase"

// const spots = [
//   {
//     id: 1, name: 'Model Town Park Gate',
//     meta: '200m · 2 hrs ago',
//     tags: [{ label: 'Garbage', cls: 'tag-red' }, { label: 'Littering', cls: 'tag-orange' }],
//     upvotes: 24, drive: '1 drive planned', iconBg: 'rgba(229,57,53,0.12)', iconColor: '#ef5350', type: 'trash'
//   },
//   {
//     id: 2, name: 'Sector 32 Bus Stand',
//     meta: '450m · 5 hrs ago',
//     tags: [{ label: 'Littering', cls: 'tag-orange' }],
//     upvotes: 11, drive: 'Be first to plan', iconBg: 'rgba(251,140,0,0.1)', iconColor: '#ffa726', type: 'alert'
//   },
//   {
//     id: 3, name: 'Civil Lines Garden',
//     meta: '800m · Fixed yesterday',
//     tags: [{ label: 'Cleaned ✓', cls: 'tag-green' }],
//     upvotes: 38, drive: 'See before/after', iconBg: 'rgba(34,197,94,0.1)', iconColor: '#4ADE80', type: 'check', heart: true
//   },
// ]
// const mapContainerStyle = {
//   width: '100%',
//   height: '180px'
// }
// export default function HomeScreen({ onReport ,onViewReports }) {
//   const [activeChip, setActiveChip] = useState('All spots')
//   const [location, setLocation] = useState(null)
//   const [reports, setReports] = useState([])
//   const [locationError, setLocationError] = useState(false)
//   const chips = ['All spots', 'Garbage', 'Littering', 'Dirty water', 'Fixed']
//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude
//         })
//       },
//       (error) => {
//         console.error(error)
//         setLocationError(true)
//       }
//     );
//     loadReports();
//   }, []);

//   const loadReports = async () => {
//   try {
//     const snapshot = await getDocs(collection(db, "reports"));

//     const data = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     setReports(data);
//   } catch (err) {
//     console.error(err);
//   }
// };
//   return (
//     <div className="screen">
//       {/* Topbar */}
//       <div className="topbar">
//         <div>
//           <div className="topbar-title">WeSeed</div>
//           <div className="topbar-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
//             <MapPin size={10} color="#22C55E" />
//             {
//               locationError
//                 ? "Location access denied"
//                 : location
//                   ? "Current location available"
//                   : "Detecting location..."
//             }
//           </div>
//         </div>
//         <div style={{ display: 'flex', gap: 10 }}>
//           <button className="icon-btn"><Bell size={16} color="#4ADE80" /></button>
//           <button className="icon-btn"><User size={16} color="#4ADE80" /></button>
//         </div>
//       </div>

//       <div className="scroll">
//         {/* Map */}
//         <div
//           style={{
//             margin: '0 20px 14px',
//             borderRadius: 20,
//             overflow: 'hidden'
//           }}
//         >
//           <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//             {location && (
//               <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={{
//                   lat: location.lat,
//                   lng: location.lng
//                 }}
//                 zoom={15}
//               >
//                 {/* User location marker */}
// <Marker
//   position={{ lat: location.lat, lng: location.lng }}
//   icon={{
//     url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
//   }}
// />

// {/* Report markers from Firestore */}
// {reports
//   .filter(r => typeof r.latitude === 'number' && typeof r.longitude === 'number')
//   .map(report => (
//     <Marker
//       key={report.id}
//       position={{ lat: report.latitude, lng: report.longitude }}
//       title={report.tag}
//     />
//   ))}
//               </GoogleMap>
//             )}
//           </LoadScript>
//         </div>
       
// {/* Buttons */}
// <div
//   style={{
//     margin: "0 20px 14px",
//     display: "flex",
//     justifyContent: "space-between",
//     gap: 10,
//   }}
// >

//   <button
//    onClick={onViewReports}
//     style={{
//       flex: 1,
//       padding: "10px",
//       borderRadius: "12px",
//       border: "none",
//       background: "#22C55E",
//       color: "#fff",
//       fontWeight: "600",
//       cursor: "pointer",
//     }}
//   >
//     📄 View Reports
//   </button>

//   <button
//     style={{
//       flex: 1,
//       padding: "10px",
//       borderRadius: "12px",
//       border: "1px solid #22C55E",
//       background: "transparent",
//       color: "#22C55E",
//       fontWeight: "600",
//       cursor: "pointer",
//     }}
//   >
//     🔥 Hotspots
//   </button>
// </div>

//         {/* Filter chips */}
//         <div className="filter-row">
//           {chips.map(c => (
//             <button key={c} className={`chip ${activeChip === c ? 'active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
//           ))}
//         </div>

//         <div className="sec-label">
//   {reports.length > 0 ? `${reports.length} spots reported near you` : 'No reports yet — be the first!'}
// </div>

// {reports.length === 0 && (
//   <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', fontSize: 13 }}>
//     🌱 No reports yet in your area.<br />Be the first to report an issue.
//   </div>
// )}

// {reports.map(report => (
//   <div key={report.id} className="glass-card" style={{ margin: '0 20px 10px', cursor: 'pointer' }} onClick={onReport}>
//     <div style={{ display: 'flex', gap: 10 }}>
//       {report.photo && (
//         <img
//           src={report.photo}
//           alt="report"
//           style={{ width: 50, height: 50, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
//         />
//       )}
//       {!report.photo && (
//         <div style={{ width: 50, height: 50, borderRadius: 12, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>
//           🗑️
//         </div>
//       )}
//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{report.tag}</div>
//         <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 5 }}>
//           {report.createdAt?.toDate
//             ? new Date(report.createdAt.toDate()).toLocaleString()
//             : 'Just now'}
//         </div>
//         <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
//           <span className={`tag ${report.severity === 'Mild' ? 'tag-green' : report.severity === 'Moderate' ? 'tag-orange' : 'tag-red'}`}>
//             {report.severity}
//           </span>
//           <span className="tag tag-green">{report.status || 'Open'}</span>
//         </div>
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//           <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
//             <ArrowUp size={11} /> {report.upvotes || 0}
//           </button>
//           <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.1)', color: '#4ADE80', padding: '2px 8px', borderRadius: 10 }}>
//             {report.analysis?.issueType || report.tag}
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// ))}

//             {/* FAB */}
//       <button
//         onClick={onReport}
//         style={{
//           position: 'absolute',
//           bottom: 90,
//           right: 20,
//           width: 50,
//           height: 50,
//           borderRadius: '50%',
//           background: 'linear-gradient(135deg, #16a34a, #22C55E)',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           border: 'none',
//           cursor: 'pointer',
//           zIndex: 50,
//           boxShadow: '0 4px 20px rgba(34,197,94,0.3)'
//         }}
//       >
//         <Plus size={24} color="#fff" />
//       </button>

//     </div>
//   )
// }



import { useState, useEffect } from 'react'
import { Bell, User, MapPin, ArrowUp, Plus } from 'lucide-react'
import { GoogleMap, Marker, LoadScript,Circle,InfoWindow } from '@react-google-maps/api'
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

const mapContainerStyle = {
  width: '100%',
  height: '180px'
}

export default function HomeScreen({ onReport, onViewReports ,onViewHotspots}) {
  const [activeChip, setActiveChip] = useState('All spots')
  const [location, setLocation] = useState(null)
  const [reports, setReports] = useState([])
  const [locationError, setLocationError] = useState(false)
  const chips = ['All spots', 'Garbage', 'Littering', 'Dirty water', 'Fixed']
  const [hotspots, setHotspots] = useState([])
const [selectedHotspot, setSelectedHotspot] = useState(null)


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
    loadReports()
  }, [])

  const loadReports = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reports"))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }))
      setReports(data)
      calculateHotspots(data)
    } catch (err) {
      console.error(err)
    }
  }
const getIssueUI = (tag) => {
  const issue = tag?.toLowerCase() || "";

  if (issue.includes("garbage"))
    return {
      icon: "🗑️",
      bg: "rgba(229,57,53,0.12)",
      color: "#ef5350",
    };

  if (issue.includes("litter"))
    return {
      icon: "🚯",
      bg: "rgba(251,140,0,0.12)",
      color: "#fb8c00",
    };

  if (issue.includes("dirty"))
    return {
      icon: "💧",
      bg: "rgba(59,130,246,0.12)",
      color: "#3b82f6",
    };

  if (issue.includes("street"))
    return {
      icon: "💡",
      bg: "rgba(255,193,7,0.12)",
      color: "#FFC107",
    };

  if (issue.includes("pothole"))
    return {
      icon: "🕳️",
      bg: "rgba(120,120,120,0.12)",
      color: "#9ca3af",
    };

  return {
    icon: "📍",
    bg: "rgba(34,197,94,0.12)",
    color: "#22C55E",
  };
};
const calculateHotspots = (reports) => {

  const grouped = {}

  reports.forEach(report => {

    if (
      typeof report.latitude !== "number" ||
      typeof report.longitude !== "number"
    ) return

    const lat = report.latitude.toFixed(3)
    const lng = report.longitude.toFixed(3)

    const issue = report.tag || "Unknown"
    const key = `${issue}-${lat}-${lng}`

   if (!grouped[key]) {
  grouped[key] = {
    center: {
      lat: report.latitude,
      lng: report.longitude
    },

    totalLat: 0,
    totalLng: 0,

    issue: issue,
    reports: [],
    score: 0
  }
}

    grouped[key].reports.push(report)
    grouped[key].totalLat += report.latitude
    grouped[key].totalLng += report.longitude

    const weight =
      report.severity === "Critical"
        ? 60
        : report.severity === "High"
        ? 40
        : report.severity === "Moderate"
        ? 20
        : 5

    grouped[key].score += weight + 20
  })
Object.values(grouped).forEach(hotspot => {
  hotspot.center = {
    lat: hotspot.totalLat / hotspot.reports.length,
    lng: hotspot.totalLng / hotspot.reports.length,
  }
})
  setHotspots(Object.values(grouped))
}
  return (
    <div className="screen">

      {/* Topbar */}
      <div className="topbar">
        <div>
          <div className="topbar-title">WeSeed</div>
          <div className="topbar-sub" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <MapPin size={10} color="#22C55E" />
            {locationError
              ? "Location access denied"
              : location
                ? "Current location available"
                : "Detecting location..."}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="icon-btn"><Bell size={16} color="#4ADE80" /></button>
          <button className="icon-btn"><User size={16} color="#4ADE80" /></button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scroll">

        {/* Map */}
        <div style={{ margin: '0 20px 14px', borderRadius: 20, overflow: 'hidden' }}>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            {location ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: location.lat, lng: location.lng }}
                zoom={15}
              >
                {/* Blue dot — user location */}
                <Marker
                  position={{ lat: location.lat, lng: location.lng }}
                  icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png' }}
                />

                {/* Firestore report markers */}
                {reports
                  .filter(r => typeof r.latitude === 'number' && typeof r.longitude === 'number')
                  .map(report => (
                    <Marker
                      key={report.id}
                      position={{ lat: report.latitude, lng: report.longitude }}
                      title={report.tag}
                    />
                  ))}
                  {hotspots.map((hotspot, index) => {
                    const hotspotColor =
  hotspot.issue.toLowerCase().includes("garbage")
    ? "#ef4444"
    : hotspot.issue.toLowerCase().includes("pothole")
    ? "#6b7280"
    : hotspot.issue.toLowerCase().includes("dirty")
    ? "#3b82f6"
    : hotspot.issue.toLowerCase().includes("litter")
    ? "#facc15"
    : "#22C55E";
return (
  <Circle
    key={hotspot.issue + index}
    center={hotspot.center}

    radius={80 + hotspot.reports.length * 20}

    options={{
     fillColor: hotspotColor,
     strokeColor: hotspotColor,
    fillOpacity: 0.25,
      strokeWeight: 2,
    }}

    onClick={() => setSelectedHotspot(hotspot)}
  />
  )
})}
              </GoogleMap>
            ) : (
              <div style={{ height: 180, background: '#0d1f10', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: 12 }}>
                {locationError ? '📍 Location denied — enable to see map' : '📍 Loading map...'}
              </div>
            )}
          </LoadScript>
        </div>

        {/* Action buttons */}
        <div style={{ margin: "0 20px 14px", display: "flex", gap: 10 }}>
          <button
            onClick={onViewReports}
            style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "none", background: "#22C55E", color: "#fff", fontWeight: "600", cursor: "pointer", fontFamily: 'inherit' }}
          >
            📄 View Reports
          </button>
          <button onClick={onViewHotspots}
            style={{ flex: 1, padding: "10px", borderRadius: "12px", border: "1px solid #22C55E", background: "transparent", color: "#22C55E", fontWeight: "600", cursor: "pointer", fontFamily: 'inherit' }}
          >
            🔥 Hotspots
          </button>
        </div>

        {/* Filter chips */}
        <div className="filter-row">
          {chips.map(c => (
            <button
              key={c}
              className={`chip ${activeChip === c ? 'active' : ''}`}
              onClick={() => setActiveChip(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Section label */}
        <div className="sec-label">
          {reports.length > 0
            ? `${reports.length} spots reported near you`
            : 'No reports yet — be the first!'}
        </div>

        {/* Empty state */}
        {reports.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-dim)', fontSize: 13 }}>
            🌱 No reports yet in your area.<br />Be the first to report an issue.
          </div>
        )}

        {/* Report cards from Firestore */}
        {reports.map(report => {
          const issueUI = getIssueUI(report.tag);
         return (
          <div
            key={report.id}
            className="glass-card"
            style={{ margin: '0 20px 10px', cursor: 'pointer' }}
            onClick={onReport}
          >
            <div style={{ display: 'flex', gap: 10 }}>

              {/* Photo or fallback icon */}
              <div
style={{
width:55,
height:55,
borderRadius:14,
background:issueUI.bg,
display:"flex",
justifyContent:"center",
alignItems:"center",
overflow:"hidden",
flexShrink:0
}}
>

{report.photo ? (

<img
src={report.photo}
alt="report"
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

) : (

<span style={{fontSize:26}}>
{issueUI.icon}
</span>

)}

</div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
                  {report.tag}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 5 }}>
                  {report.createdAt?.toDate
  ? report.createdAt.toDate().toLocaleString()
  : "Just now"}
                </div>
                <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:6 }}>

  <span className={`tag ${
    report.severity === 'Mild'
      ? 'tag-green'
      : report.severity === 'Moderate'
      ? 'tag-orange'
      : 'tag-red'
  }`}>
    {report.severity}
  </span>

  <span className="tag tag-green">
    {report.status || "Open"}
  </span>

  {report.analysis?.department && (
    <span
      className="tag"
      style={{
        background:"rgba(59,130,246,.15)",
        color:"#60A5FA"
      }}
    >
      🤖 AI Verified
    </span>
  )}

</div>
{report.analysis?.risk && (
  <div
    style={{
      fontSize:11,
      color:'var(--text-dim)',
      marginBottom:8
    }}
  >
    ⚠ {report.analysis.risk}
  </div>
)}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <ArrowUp size={11} /> {report.upvotes || 0}
                  </button>
                  <span style={{ fontSize: 10, background: 'rgba(34,197,94,0.1)', color: '#4ADE80', padding: '2px 8px', borderRadius: 10 }}>
                    {report.analysis?.department || report.tag}
                  </span>
                </div>
              </div>
            </div>
          </div>
                );
      })}

      </div>
      {/* END scroll */}

      {/* FAB — outside scroll, inside screen */}
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
