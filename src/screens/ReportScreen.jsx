import { analyzeImage } from "../services/geminiService";
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, MapPin, AlertTriangle, Wifi, Zap } from 'lucide-react';
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

const SeverityColors = {
  Mild: { border: 'rgba(34,197,94,0.4)', bg: 'rgba(34,197,94,0.1)', color: '#4ADE80' },
  Moderate: { border: 'rgba(251,140,0,0.35)', bg: 'rgba(251,140,0,0.1)', color: '#ffa726' },
  Severe: { border: 'rgba(229,57,53,0.4)', bg: 'rgba(229,57,53,0.1)', color: '#ef5350' },
  Critical: { border: 'rgba(220,38,38,0.5)', bg: 'rgba(220,38,38,0.15)', color: '#ef4444' },
};

const UrgencyColors = {
  Low: '#4ADE80', Medium: '#fbbf24', High: '#f97316', Immediate: '#ef4444',
};

function ConfidenceBar({ value }) {
  const pct = typeof value === 'number' ? value : parseInt(value) || 0;
  const color = pct >= 80 ? '#4ADE80' : pct >= 60 ? '#fbbf24' : '#f97316';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 5 }}>
        <span style={{ color: 'var(--text-dim)' }}>AI Confidence</span>
        <span style={{ color, fontWeight: 600 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`, borderRadius: 999,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          transition: 'width 1s ease-out',
        }} />
      </div>
    </div>
  );
}

function AIAnalysisCard({ data }) {
  const sev = SeverityColors[data.severity] || SeverityColors.Moderate;
  const urgColor = UrgencyColors[data.urgency] || '#fbbf24';

  return (
    <div style={{
      margin: '0 20px 14px',
      borderRadius: 16,
      border: '1px solid rgba(34,197,94,0.25)',
      background: 'rgba(13,26,15,0.9)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 14px 10px',
        borderBottom: '0.5px solid rgba(34,197,94,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: 15 }}>🌱</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#4ADE80' }}>Seed Agent</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#4ADE80' }}>
          <span className="pulse-dot" />
          Analysis complete
        </div>
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Issue + Severity row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Issue Detected</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{data.issueType}</div>
          </div>
          <span style={{
            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
            background: sev.bg, border: `0.5px solid ${sev.border}`, color: sev.color,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{data.severity}</span>
        </div>

        {/* Confidence */}
        <ConfidenceBar value={data.confidence} />

        {/* Tags row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {data.urgency && (
            <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: `${urgColor}18`, border: `0.5px solid ${urgColor}44`, color: urgColor }}>
              ⚡ {data.urgency} urgency
            </span>
          )}
          {data.healthHazard && data.healthHazard !== 'None' && (
            <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: 'rgba(239,68,68,0.1)', border: '0.5px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              🏥 {data.healthHazard} health risk
            </span>
          )}
          {data.estimatedAffectedArea && (
            <span style={{ padding: '3px 9px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
              📐 {data.estimatedAffectedArea}
            </span>
          )}
        </div>

        {/* Authority */}
        {data.department && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>Authority</div>
            <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: 'rgba(99,102,241,0.12)', border: '0.5px solid rgba(99,102,241,0.3)', color: '#a5b4fc' }}>
              🏛 {data.department}
            </span>
          </div>
        )}

        {/* Risk */}
        {data.risk && (
          <div style={{ padding: '8px 10px', borderRadius: 10, background: 'rgba(251,140,0,0.07)', border: '0.5px solid rgba(251,140,0,0.15)' }}>
            <div style={{ fontSize: 10, color: '#fbbf24', fontWeight: 600, marginBottom: 3 }}>⚠ Public Risk</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{data.risk}</div>
          </div>
        )}

        {/* Recommended Action */}
        {data.suggestedAction && (
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Recommended Action</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>→ {data.suggestedAction}</div>
          </div>
        )}

        {/* Summary callout */}
        {data.summary && (
          <div style={{
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(34,197,94,0.06)',
            border: '0.5px solid rgba(34,197,94,0.2)',
            borderLeft: '3px solid #22C55E',
          }}>
            <div style={{ fontSize: 11, color: '#4ADE80', fontWeight: 600, marginBottom: 4 }}>Summary</div>
            <div style={{ fontSize: 12, color: '#86EFAC', lineHeight: 1.6 }}>{data.summary}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function AILoadingCard() {
  return (
    <div style={{
      margin: '0 20px 14px', borderRadius: 16,
      border: '1px solid rgba(34,197,94,0.2)',
      background: 'rgba(13,26,15,0.9)',
      padding: '16px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse 1.5s infinite',
        }}>
          <span style={{ fontSize: 18 }}>🌱</span>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#4ADE80' }}>Seed Agent is analysing your image...</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 2 }}>Detecting issue type, severity & risk</div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[80, 60, 40].map((w, i) => (
          <div key={i} style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${w}%`,
              background: 'linear-gradient(90deg, rgba(34,197,94,0.2), rgba(34,197,94,0.05))',
              borderRadius: 4,
              animation: `shimmer 1.5s ease-in-out ${i * 0.2}s infinite alternate`,
            }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes shimmer {
          from { opacity: 0.4; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function AIErrorCard() {
  return (
    <div style={{
      margin: '0 20px 14px', borderRadius: 16,
      border: '1px solid rgba(251,140,0,0.25)',
      background: 'rgba(20,14,8,0.95)',
      padding: '14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>⚠</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#fbbf24' }}>Seed Agent</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
        AI analysis is currently unavailable.
      </div>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.7 }}>
        Possible reasons:<br />
        • Gemini quota exceeded<br />
        • Network issue<br />
        • Temporary service interruption
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: '#fbbf24' }}>
        You can still submit your report manually.
      </div>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: 100, left: '50%', transform: 'translateX(-50%)',
      background: '#1a2e20', border: '0.5px solid rgba(34,197,94,0.3)',
      borderRadius: 20, padding: '10px 18px', fontSize: 12, color: '#4ADE80',
      zIndex: 999, whiteSpace: 'nowrap', boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    }}>
      {message}
    </div>
  );
}

export default function ReportScreen({ onBack }) {
  const [selectedTag, setSelectedTag] = useState('Garbage dump');
  const [severity, setSeverity] = useState('Moderate');
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiState, setAiState] = useState('idle'); // idle | loading | done | error
  const [toast, setToast] = useState(null);
  const fileRef = useRef();
  const videoRef = useRef();
  const [showCamera, setShowCamera] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => setCurrentLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      (error) => console.error('Location error:', error)
    );
  }, []);

  const processFile = (file) => {
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
    setAnalysis(null);
    setAiState('loading');

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64 = reader.result.split(',')[1];
        const result = await analyzeImage(base64, file.type);
        const data = JSON.parse(result);
        setAnalysis(data);
        setAiState('done');

        if (data.severity) {
          const s = data.severity.toLowerCase();
          setSeverity(s.includes('high') || s.includes('severe') || s.includes('critical') ? 'Severe' :
                     s.includes('medium') || s.includes('moderate') ? 'Moderate' : 'Mild');
        }
        if (data.issueType) {
          const match = tagOptions.find(t =>
            data.issueType.toLowerCase().includes(t.label.toLowerCase().split(' ')[0])
          );
          if (match) setSelectedTag(match.label);
        }
      } catch (err) {
        setAiState('error');
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      setShowCamera(true);
    } catch {
      setToast('📷 Camera not available or permission denied');
    }
  };

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob((blob) => {
      const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
      processFile(file);
      setShowCamera(false);
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }, 'image/jpeg', 0.85);
  };

  const submitReport = async () => {
  console.log("Submit clicked");

  if (!photoFile) {
    console.log("No photo");
    setToast("📸 Please take or upload a photo first.");
    return;
  }

  if (!currentLocation) {
    console.log("No location");
    setToast("📍 Location not detected yet.");
    return;
  }

  try {
    console.log("Starting Firestore upload...");

    setSubmitting(true);

    const docRef = await addDoc(collection(db, "reports"), {
      tag: selectedTag,
      severity,
      note,
      analysis: analysis || {},
      photo: photo || "",
      location: `${currentLocation.latitude.toFixed(5)}, ${currentLocation.longitude.toFixed(5)}`,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      createdAt: serverTimestamp(),
      status: "Open",
      resolved: false,
      upvotes: 0,
    });

    console.log("SUCCESS");
    console.log(docRef.id);

    setToast("🌱 Report submitted!");

    setTimeout(onBack, 1500);

  } catch (error) {
    console.error("FIRESTORE ERROR:");
    console.error(error);
    console.error(error.code);
    console.error(error.message);

    setToast("❌ Failed to submit.");

  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="screen">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div style={{ background: '#0d1a0f', padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid rgba(34,197,94,0.08)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={15} color="#4ADE80" />
        </button>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>Report a spot</span>
      </div>

      <div className="scroll" style={{ padding: '0 0 20px' }}>

        {/* Photo Section */}
        <div style={{ margin: '14px 20px', position: 'relative' }}>
          <div
            onClick={() => !photo && fileRef.current.click()}
            style={{
              height: photo ? 'auto' : 150,
              minHeight: photo ? 160 : 150,
              background: 'rgba(255,255,255,0.02)',
              border: '1.5px dashed rgba(34,197,94,0.2)',
              borderRadius: 18,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, cursor: photo ? 'default' : 'pointer', overflow: 'hidden',
            }}
          >
            {photo ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <img src={photo} alt="spot" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 16, display: 'block' }} />
                <button
                  onClick={() => { setPhoto(null); setPhotoFile(null); setAnalysis(null); setAiState('idle'); }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 26, height: 26, color: '#fff', cursor: 'pointer', fontSize: 13 }}
                >✕</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={(e) => { e.stopPropagation(); takePhoto(); }} style={{ padding: '12px 20px', background: '#22C55E', color: '#000', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer', fontSize: 13 }}>📸 Camera</button>
                <button onClick={(e) => { e.stopPropagation(); fileRef.current.click(); }} style={{ padding: '12px 20px', background: 'transparent', border: '1px solid #22C55E', color: '#22C55E', borderRadius: 12, cursor: 'pointer', fontSize: 13 }}>📁 Upload</button>
              </div>
            )}
          </div>
        </div>

        <input type="file" ref={fileRef} accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />

        {/* Camera overlay */}
        {showCamera && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '80%', objectFit: 'cover' }} />
            <div style={{ padding: 20, display: 'flex', gap: 12 }}>
              <button onClick={capturePhoto} style={{ flex: 1, padding: 16, background: '#22C55E', color: '#000', border: 'none', borderRadius: 12, fontWeight: 600 }}>Capture</button>
              <button onClick={() => setShowCamera(false)} style={{ flex: 1, padding: 16, background: '#333', color: '#fff', border: 'none', borderRadius: 12 }}>Cancel</button>
            </div>
          </div>
        )}

        {/* AI Card */}
        {aiState === 'loading' && <AILoadingCard />}
        {aiState === 'done' && analysis && <AIAnalysisCard data={analysis} />}
        {aiState === 'error' && <AIErrorCard />}

        {/* Tag Picker */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>What is it?</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {tagOptions.map(t => (
              <button key={t.label} onClick={() => setSelectedTag(t.label)} style={{
                border: `0.5px solid ${selectedTag === t.label ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 12, padding: '9px 10px', display: 'flex', alignItems: 'center', gap: 7,
                cursor: 'pointer', background: selectedTag === t.label ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)',
                fontFamily: 'inherit', transition: 'all 0.15s ease',
              }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ fontSize: 12, color: selectedTag === t.label ? '#86EFAC' : '#6b7c6e' }}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>How bad is it?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Mild', 'Moderate', 'Severe'].map(s => {
              const col = SeverityColors[s];
              const active = severity === s;
              return (
                <button key={s} onClick={() => setSeverity(s)} style={{
                  flex: 1, padding: '9px', borderRadius: 10,
                  border: `0.5px solid ${active ? col.border : 'rgba(255,255,255,0.07)'}`,
                  fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  background: active ? col.bg : 'rgba(255,255,255,0.02)',
                  color: active ? col.color : '#6b7c6e',
                  transition: 'all 0.15s ease',
                }}>{s}</button>
              );
            })}
          </div>
        </div>

        {/* Location */}
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
          </div>
        </div>

        {/* Note */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>
            Add a note <span style={{ textTransform: 'none', color: '#2d4a32' }}>(optional)</span>
          </div>
          <textarea
            placeholder="Describe what you see..."
            value={note} onChange={(e) => setNote(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)', resize: 'none', outline: 'none' }}
            rows={3}
          />
        </div>

        <div style={{ padding: '0 20px' }}>
          <button className="btn-primary" onClick={submitReport} disabled={submitting || loading} style={{ opacity: submitting ? 0.7 : 1 }}>
            <MapPin size={16} /> {submitting ? 'Submitting...' : 'Submit report'}
          </button>
        </div>
      </div>
    </div>
  );
}
