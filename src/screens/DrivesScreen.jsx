
import { useState ,useEffect} from 'react'
import { Plus, Clock, MapPin, Check, X, Calendar, Users } from 'lucide-react'

const DRIVES_DATA = [
  {
    id: 1, title: 'Model Town Park Gate cleanup',
    tag: { label: 'Garbage', cls: 'tag-red' },
    time: 'Sun 7:00 AM', distance: '200m away',
    people: ['RS', 'AK', 'PM'], extra: '+4 joining',
    joined: true, week: 'This Sunday', category: 'Garbage',
    colors: ['#1a4a20', '#1a2a4a', '#4a1a2a'],
    textColors: ['#4ADE80', '#64b5f6', '#f48fb1'],
    volunteers: 7, maxVolunteers: 15,
    createdByMe: false,
  },
  {
    id: 2, title: 'Sector 32 Bus Stand drive',
    tag: { label: 'Littering', cls: 'tag-orange' },
    time: 'Sun 8:30 AM', distance: '450m away',
    people: ['VK', 'NS'], extra: '2 joining',
    joined: false, week: 'This Sunday', category: 'Littering',
    colors: ['#1a3a20', '#3a2a1a'],
    textColors: ['#4ADE80', '#ffa726'],
    volunteers: 2, maxVolunteers: 10,
    createdByMe: false,
  },
  {
    id: 3, title: 'Civil Lines Garden beautification',
    tag: { label: 'Park', cls: 'tag-green' },
    time: 'Sat 6:30 AM', distance: '800m away',
    people: ['RK', 'SP', 'DM'], extra: '+8 joining',
    joined: false, week: 'Next Weekend', category: 'Park',
    colors: ['#1a2a3a', '#3a1a3a', '#3a1a1a'],
    textColors: ['#64b5f6', '#ce93d8', '#ef9a9a'],
    volunteers: 11, maxVolunteers: 20,
    createdByMe: false,
  },
]

// ─── Plan Drive Screen ────────────────────────────────────────────────────────
// Exported so App.jsx can render it as a full screen (same way ReportScreen works)
export function PlanDriveScreen({ onBack, onSubmit }) {
  const [form, setForm] = useState({
    name: '', location: '', date: '', time: '',
    description: '', volunteers: '', category: 'Garbage',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.03)',
    border: '0.5px solid rgba(34,197,94,0.15)', borderRadius: 10,
    padding: '10px 12px', fontSize: 13, fontFamily: 'inherit',
    color: 'var(--text-primary)', outline: 'none', marginBottom: 12,
  };

  const label = (text) => (
    <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5, fontWeight: 500 }}>{text}</div>
  );

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ background: '#0d1a0f', padding: '10px 20px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid rgba(34,197,94,0.08)', flexShrink: 0 }}>
        <button onClick={onBack} style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={15} color="#4ADE80" />
        </button>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Plan a Drive</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>Organise a community cleanup</div>
        </div>
      </div>

      <div className="scroll" style={{ padding: '16px 20px 24px' }}>
        {label('Drive Name')}
        <input style={inputStyle} placeholder="e.g. Model Town Park Cleanup" value={form.name} onChange={e => set('name', e.target.value)} />

        {label('Location')}
        <input style={inputStyle} placeholder="Specific address or landmark" value={form.location} onChange={e => set('location', e.target.value)} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            {label('Date')}
            <input type="date" style={inputStyle} value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
          <div>
            {label('Time')}
            <input type="time" style={inputStyle} value={form.time} onChange={e => set('time', e.target.value)} />
          </div>
        </div>

        {label('Category')}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
          {['Garbage', 'Littering', 'Dirty water', 'Pothole', 'Park', 'Other'].map(c => (
            <button key={c} onClick={() => set('category', c)} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 11,
              border: `0.5px solid ${form.category === c ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.07)'}`,
              background: form.category === c ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)',
              color: form.category === c ? '#4ADE80' : 'var(--text-dim)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s ease',
            }}>{c}</button>
          ))}
        </div>

        {label('Expected Volunteers')}
        <input type="number" style={inputStyle} placeholder="e.g. 10" value={form.volunteers} onChange={e => set('volunteers', e.target.value)} />

        {label('Description')}
        <textarea
          style={{ ...inputStyle, resize: 'none' }}
          placeholder="What's the plan? What should volunteers bring?"
          value={form.description} onChange={e => set('description', e.target.value)}
          rows={4}
        />

        <button
          onClick={() => { onSubmit(form); onBack(); }}
          style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #16a34a, #22C55E)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Calendar size={16} /> Schedule Drive
        </button>
      </div>
    </div>
  );
}

// ─── Drives Screen ────────────────────────────────────────────────────────────
export default function DrivesScreen({
  onPlanDrive,
  plannedDrive,
}) {
  const [joined, setJoined] = useState({ 1: true, 2: false, 3: false })
  const [activeChip, setActiveChip] = useState('Near me')
  const [drives, setDrives] = useState(DRIVES_DATA)
  useEffect(() => {
  if (!plannedDrive) return;

  const newDrive = {
    id: Date.now(),
    title: plannedDrive.name,
    tag: {
      label: plannedDrive.category,
      cls: "tag-green",
    },
    time: `${plannedDrive.date} ${plannedDrive.time}`,
    distance: plannedDrive.location,
    people: [],
    extra: "Be the first to join",
    joined: false,
    week: "My Drives",
    category: plannedDrive.category,
    colors: [],
    textColors: [],
    volunteers: 0,
    maxVolunteers: parseInt(plannedDrive.volunteers) || 10,
    createdByMe: true,
  };

  setDrives(prev => [newDrive, ...prev]);

}, [plannedDrive]);
  const [toast, setToast] = useState(null)
  const chips = ['Near me', 'This week', 'Joined', 'My Drives']

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const filteredDrives = drives.filter(d => {
    if (activeChip === 'Joined') return joined[d.id];
    if (activeChip === 'My Drives') {
    return d.createdByMe;
}
    if (activeChip === 'This week') return d.week === 'This Sunday';
    return true;
  });

  const weeks = [...new Set(filteredDrives.map(d => d.week))];

  const handleJoin = (id) => {
    setJoined(j => {
      const newVal = !j[id];
      showToast(newVal ? "🌱 You're in! See you at the drive." : 'Left the drive');
      return { ...j, [id]: newVal };
    });
  };

  // Called from App.jsx when PlanDriveScreen submits
  const addDrive = (form) => {
    const d = {
      createdByMe: true,
      id: Date.now(),
      title: form.name || 'New Drive',
      tag: { label: form.category, cls: 'tag-green' },
      time: `${form.date} ${form.time}`,
      distance: 'Nearby',
      people: [], extra: 'Be the first',
      joined: false, week: 'This Sunday',
      category: form.category,
      colors: [], textColors: [],
      volunteers: 1, maxVolunteers: parseInt(form.volunteers) || 10,
    };
    setDrives(prev => [d, ...prev]);
    setJoined(j => ({ ...j, [d.id]: false }));
    showToast('🌱 Drive planned! Volunteers can now join.');
  };

  return (
    <div className="screen">
      {toast && (
        <div style={{ position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)', background: '#1a2e20', border: '0.5px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '10px 18px', fontSize: 12, color: '#4ADE80', zIndex: 50, whiteSpace: 'nowrap' }}>
          {toast}
        </div>
      )}

      <div className="topbar">
        <div>
          <div className="topbar-title">Community Action</div>
          <div className="topbar-sub">{drives.length} near you this week</div>
        </div>
        <button onClick={() => onPlanDrive(addDrive)} className="btn-ghost" style={{ width: 'auto', padding: '7px 14px', fontSize: 12 }}>
          <Plus size={13} /> Plan drive
        </button>
      </div>

      <div className="filter-row">
        {chips.map(c => (
          <button key={c} className={`chip ${activeChip === c ? 'active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
        ))}
      </div>

      <div className="scroll">
        {filteredDrives.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            {activeChip === 'Joined' ? "You haven't joined any drives yet."
              : activeChip === 'Past' ? 'No past drives to show.'
              : 'No drives match this filter.'}
          </div>
        ) : (
          weeks.map(week => (
            <div key={week}>
              <div className="sec-label">{week}</div>
              {filteredDrives.filter(d => d.week === week).map(drive => {
                const volunteerPct = Math.min(100, Math.round((drive.volunteers / drive.maxVolunteers) * 100));
                return (
                  <div key={drive.id} className="glass-card" style={{ margin: '0 20px 10px', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '12px 14px 10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span className={`tag ${drive.tag.cls}`}>{drive.tag.label}</span>
                        {joined[drive.id] && (
                          <span style={{ fontSize: 10, color: '#4ADE80', background: 'rgba(34,197,94,0.08)', border: '0.5px solid rgba(34,197,94,0.2)', borderRadius: 20, padding: '2px 8px' }}>Joined ✓</span>
                        )}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{drive.title}</div>
                      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{drive.time}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} />{drive.distance}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={10} />{drive.volunteers}/{drive.maxVolunteers}</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${volunteerPct}%`, height: '100%', background: 'linear-gradient(to right, #16a34a, #4ADE80)', borderRadius: 999 }} />
                      </div>
                    </div>

                    <div style={{ borderTop: '0.5px solid rgba(34,197,94,0.08)', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(34,197,94,0.02)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex' }}>
                          {drive.people.map((p, i) => (
                            <div key={p} style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid #0B0F0C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 500, marginLeft: i === 0 ? 0 : -6, background: drive.colors[i] || '#1a3020', color: drive.textColors[i] || '#4ADE80' }}>{p}</div>
                          ))}
                        </div>
                        {drive.extra && <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>{drive.extra}</span>}
                      </div>
                      <button
                        onClick={() => handleJoin(drive.id)}
                        style={{ fontSize: 11, fontWeight: 600, color: joined[drive.id] ? '#4ADE80' : '#0B0F0C', background: joined[drive.id] ? 'rgba(34,197,94,0.1)' : '#22C55E', border: joined[drive.id] ? '0.5px solid rgba(34,197,94,0.2)' : 'none', borderRadius: 20, padding: '6px 16px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4, transition: 'all 0.2s ease' }}>
                        {joined[drive.id] ? <><Check size={10} /> Joined</> : 'Join'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        <div style={{ margin: '4px 20px 0' }}>
          <button className="btn-ghost" onClick={() => onPlanDrive(addDrive)}>
            <Plus size={14} /> Plan a new drive
          </button>
        </div>
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}