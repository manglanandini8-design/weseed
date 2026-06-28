import { analyzeImage } from "../services/geminiService";
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, MapPin } from 'lucide-react';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const tagOptions = [
  { label: 'Garbage dump', icon: '🗑️' },
  { label: 'Dirty water', icon: '💧' },
  { label: 'Open burning', icon: '🔥' },
  { label: 'Littering', icon: '🚯' },
  { label: 'Open defecation', icon: '🚽' },
  { label: 'Water Leakage', icon: '🚰' },
  { label: 'pothole', icon: '🕳️' },
  { label: 'other', icon: '➕' },
];

export default function ReportScreen({ onBack }) {
  const [selectedTag, setSelectedTag] = useState('Garbage dump');
  const [severity, setSeverity] = useState('Moderate');
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const videoRef = useRef();
  const [showCamera, setShowCamera] = useState(false);

  let parsedAnalysis = null;
  try {
    parsedAnalysis = analysis ? JSON.parse(analysis) : null;
  } catch (e) {
    console.error("Invalid JSON from Gemini", e);
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.error("Location error:", error)
    );
  }, []);

  const processFile = (file) => {
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhoto(url);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setLoading(true);
        const base64 = reader.result.split(",")[1];
        const result = await analyzeImage(base64, file.type);
        const data = JSON.parse(result);
        setAnalysis(JSON.stringify(data));

        if (data.severity) {
          const s = data.severity.toLowerCase();
          setSeverity(s.includes("high") || s.includes("severe") || s.includes("critical") ? "Severe" : 
                     s.includes("medium") || s.includes("moderate") ? "Moderate" : "Mild");
        }
      } catch (err) {
        setError("AI analysis failed.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch (err) {
      alert("Camera not available or permission denied");
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      processFile(file);
      setShowCamera(false);
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }, 'image/jpeg', 0.85);
  };

  const submitReport = async () => {
    if (!photoFile) {
      alert('Please take or upload a photo first.');
      return;
    }
    if (!currentLocation) {
      alert('Location not detected yet.');
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'reports'), {
        tag: selectedTag,
        severity,
        note,
        analysis: parsedAnalysis,
        photo: photo,  // blob URL
        location: `${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        createdAt: serverTimestamp(),
        status: 'Open',
        resolved: false,
        upvotes: 0,
      });

      alert('Report submitted! 🌱');
      onBack();
    } catch (error) {
      console.error(error);
      alert('Failed to submit. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      <div style={{ background: '#0d1a0f', padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid rgba(34,197,94,0.08)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={15} color="#4ADE80" />
        </button>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>Report a spot</span>
      </div>

      <div className="scroll" style={{ padding: '0 0 20px' }}>
        {loading && <div style={{ margin: "0 20px 14px", padding: "14px", borderRadius: "12px", background: "rgba(34,197,94,0.08)", color: "#86EFAC" }}>Processing...</div>}
        {error && <div style={{ margin: "0 20px 14px", padding: "14px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", color: "#ef5350" }}>{error}</div>}

        {analysis && (
          <div style={{ margin: "0 20px 14px", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(34,197,94,0.15)", whiteSpace: "pre-wrap", color: "#d1d5db", fontSize: "12px", lineHeight: "1.6" }}>
            {parsedAnalysis && (
              <div>
                <p style={{ color: "#4ADE80", fontWeight: "600", marginBottom: "10px" }}>🌱 Seed Agent Analysis</p>
                <p><strong>Issue:</strong> {parsedAnalysis.issueType}</p>
                <p><strong>Severity:</strong> {parsedAnalysis.severity}</p>
                <p><strong>Risk:</strong> {parsedAnalysis.risk}</p>
                <p><strong>Authority:</strong> {parsedAnalysis.department}</p>
                <p><strong>Confidence:</strong> {parsedAnalysis.confidence}</p>
              </div>
            )}
          </div>
        )}

        {/* Photo Section */}
        <div style={{ margin: '14px 20px', height: 150, background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(34,197,94,0.2)', borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', position: 'relative' }}>
          {photo ? (
            <img src={photo} alt="spot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={takePhoto} style={{ padding: '12px 24px', background: '#22C55E', color: '#000', border: 'none', borderRadius: 12, fontWeight: 600 }}>📸 Take Photo</button>
              <button onClick={() => fileRef.current.click()} style={{ padding: '12px 24px', background: 'transparent', border: '1px solid #22C55E', color: '#22C55E', borderRadius: 12 }}>📁 Upload</button>
            </div>
          )}
        </div>

        <input type="file" ref={fileRef} accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />

        {showCamera && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '80%', objectFit: 'cover' }} />
            <div style={{ padding: 20, display: 'flex', gap: 12 }}>
              <button onClick={capturePhoto} style={{ flex: 1, padding: 16, background: '#22C55E', color: '#000', border: 'none', borderRadius: 12, fontWeight: 600 }}>Capture Photo</button>
              <button onClick={() => setShowCamera(false)} style={{ flex: 1, padding: 16, background: '#333', color: '#fff', border: 'none', borderRadius: 12 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Rest of your UI */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>What is it?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {tagOptions.map(t => (
              <button key={t.label} onClick={() => setSelectedTag(t.label)} style={{ border: `0.5px solid ${selectedTag === t.label ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', background: selectedTag === t.label ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)', fontFamily: 'inherit' }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ fontSize: 12, color: selectedTag === t.label ? '#86EFAC' : '#6b7c6e' }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>How bad is it?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Mild', 'Moderate', 'Severe'].map(s => (
              <button key={s} onClick={() => setSeverity(s)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: `0.5px solid ${severity === s ? (s === 'Severe' ? 'rgba(229,57,53,0.4)' : s === 'Moderate' ? 'rgba(251,140,0,0.3)' : 'rgba(34,197,94,0.3)') : 'rgba(255,255,255,0.07)'}`, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', background: severity === s ? (s === 'Severe' ? 'rgba(229,57,53,0.1)' : s === 'Moderate' ? 'rgba(251,140,0,0.1)' : 'rgba(34,197,94,0.08)') : 'rgba(255,255,255,0.02)', color: severity === s ? (s === 'Severe' ? '#ef5350' : s === 'Moderate' ? '#ffa726' : '#4ADE80') : '#6b7c6e' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>Location</div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, border: '0.5px solid rgba(34,197,94,0.1)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={14} color="#22C55E" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#86EFAC' }}>
                {currentLocation ? `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}` : 'Detecting location...'}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Auto-detected</div>
            </div>
            <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 500, cursor: 'pointer' }}>Change</span>
          </div>
        </div>

        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>Add a note <span style={{ textTransform: 'none', color: '#2d4a32' }}>(optional)</span></div>
          <textarea placeholder="Describe what you see..." value={note} onChange={(e)=>setNote(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)', resize: 'none', outline: 'none' }} rows={3} />
        </div>

        <div style={{ padding: '0 20px' }}>
          <button className="btn-primary" onClick={submitReport} disabled={loading}>
            <MapPin size={16} /> {loading ? 'Submitting...' : 'Submit report'}
          </button>
        </div>
      </div>
    </div>
  );
}