import { analyzeImage } from "../services/geminiService";
import { useState, useRef } from 'react'
import { ArrowLeft, Camera, MapPin } from 'lucide-react'

const tagOptions = [
  { label: 'Garbage dump', icon: '🗑️' },
  { label: 'Dirty water', icon: '💧' },
  { label: 'Open burning', icon: '🔥' },
  { label: 'Littering', icon: '🚯' },
  { label: 'Open defecation', icon: '⚠️' },
  { label: 'Other', icon: '➕' },
]

export default function ReportScreen({ onBack }) {
  const [selectedTag, setSelectedTag] = useState('Garbage dump')
  const [severity, setSeverity] = useState('Moderate')
  const [photo, setPhoto] = useState(null)
  const [analysis, setAnalysis] = useState("")
  let parsedAnalysis = null

  try {
  parsedAnalysis = analysis ? JSON.parse(analysis) : null
  } catch (e) {
  console.error("Invalid JSON from Gemini", e)
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef()
 
   const handlePhoto = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setPhoto(url)

    try {
      setLoading(true)
      setError("")
      setAnalysis("")

      const reader = new FileReader()

      reader.onloadend = async () => {
        try {
          const base64 = reader.result.split(",")[1];
          const result = await analyzeImage(base64, file.type);
          
          // Debugging: See exactly what the AI sent in the browser console
          console.log("Seed Agent Raw Output:", result);

          // Attempt to parse
         console.log(result);

          setAnalysis(result);

          return;
          setAnalysis(JSON.stringify(data)); // Save it as a clean string

          // Auto-update UI
          if (data.severity) {
            const s = data.severity.toLowerCase();
            if (s.includes("high") || s.includes("severe") || s.includes("critical")) setSeverity("Severe");
            else if (s.includes("medium") || s.includes("moderate")) setSeverity("Moderate");
            else setSeverity("Mild");
          }
        } catch (err) {
          console.error("Parsing failed:", err);
          if (err.message?.includes("RESOURCE_EXHAUSTED")) {
  setError("Gemini API quota exceeded. Try again later.")
} else {
  setError("AI analysis failed.")
}
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file)
    } catch (err) {
      console.error("File Read Error:", err)
      setError("Something went wrong with the photo.")
      setLoading(false)
    }
  }
  
  return (
    <div className="screen">
      {/* Topbar */}
      <div style={{ background: '#0d1a0f', padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid rgba(34,197,94,0.08)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <ArrowLeft size={15} color="#4ADE80" />
        </button>
        <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)' }}>Report a spot</span>
      </div>

      <div className="scroll" style={{ padding: '0 0 20px' }}>
        {/* Photo upload */}
        {loading && (
  <div
    style={{
      margin: "0 20px 14px",
      padding: "14px",
      borderRadius: "12px",
      background: "rgba(34,197,94,0.08)",
      color: "#86EFAC"
    }}
  >
    🌱 Seed Agent is analyzing the issue...
  </div>
)}

{error && (
  <div
    style={{
      margin: "0 20px 14px",
      padding: "14px",
      borderRadius: "12px",
      background: "rgba(239,68,68,0.1)",
      color: "#ef5350"
    }}
  >
    {error}
  </div>
)}

{analysis && (
  <div
    style={{
      margin: "0 20px 14px",
      padding: "14px",
      borderRadius: "12px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(34,197,94,0.15)",
      whiteSpace: "pre-wrap",
      color: "#d1d5db",
      fontSize: "12px",
      lineHeight: "1.6"
    }}
  >
    {parsedAnalysis && (
  <div>
    <p style={{ color: "#4ADE80", fontWeight: "600", marginBottom: "10px" }}>
      🌱 Seed Agent Analysis
    </p>

    <p><strong>Issue:</strong> {parsedAnalysis.issueType}</p>
    <p><strong>Severity:</strong> {parsedAnalysis.severity}</p>
    <p><strong>Risk:</strong> {parsedAnalysis.risk}</p>
    <p><strong>Authority:</strong> {parsedAnalysis.department}</p>
    <p><strong>Confidence:</strong> {parsedAnalysis.confidence}</p>

    
     )
  </div>
)}
  </div>
)}
        <input type="file" ref={fileRef} accept="image/*" capture="environment" onChange={handlePhoto} style={{ display: 'none' }} />
        <div onClick={() => fileRef.current.click()} style={{ margin: '14px 20px', height: 150, background: 'rgba(255,255,255,0.02)', border: '1.5px dashed rgba(34,197,94,0.2)', borderRadius: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', overflow: 'hidden', position: 'relative' }}>
          {photo ? (
            <>
              <img src={photo} alt="spot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 8, right: 8, background: '#22C55E', color: '#0B0F0C', fontSize: 9, padding: '2px 7px', borderRadius: 10, fontWeight: 500 }}>✓ Added</span>
            </>
          ) : (
            <>
              <Camera size={28} color="#22C55E" />
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Tap to take a photo</span>
              <span style={{ fontSize: 10, color: '#2d4a32' }}>or upload from gallery</span>
            </>
          )}
        </div>

        {/* What is it */}
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

        {/* Severity */}
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

        {/* Location */}
        <div style={{ padding: '0 20px 14px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>Location</div>
          <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, border: '0.5px solid rgba(34,197,94,0.1)' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={14} color="#22C55E" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#86EFAC' }}>Model Town Park Gate</div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>Auto-detected · Punjab</div>
            </div>
            <span style={{ fontSize: 11, color: '#22C55E', fontWeight: 500, cursor: 'pointer' }}>Change</span>
          </div>
        </div>

        {/* Note */}
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, fontWeight: 500 }}>Add a note <span style={{ textTransform: 'none', color: '#2d4a32' }}>(optional)</span></div>
          <textarea placeholder="Describe what you see..." style={{ width: '100%', background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '10px 12px', fontSize: 13, fontFamily: 'inherit', color: 'var(--text-primary)', resize: 'none', outline: 'none' }} rows={3} />
        </div>

        <div style={{ padding: '0 20px' }}>
          <button className="btn-primary" onClick={onBack}>
            <MapPin size={16} /> Submit report
          </button>
        </div>
      </div>
    </div>
  )
}
