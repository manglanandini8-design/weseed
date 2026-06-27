import { useState } from 'react'
import { Plus, Clock, MapPin, Check } from 'lucide-react'

const drives = [
  {
    id: 1, title: 'Model Town Park Gate cleanup',
    tag: { label: 'Garbage', cls: 'tag-red' },
    time: 'Sun 7:00 AM', distance: '200m away',
    people: ['RS', 'AK', 'PM'], extra: '+4 joining',
    joined: true, week: 'This Sunday',
    colors: ['#1a4a20', '#1a2a4a', '#4a1a2a'],
    textColors: ['#4ADE80', '#64b5f6', '#f48fb1'],
  },
  {
    id: 2, title: 'Sector 32 Bus Stand drive',
    tag: { label: 'Littering', cls: 'tag-orange' },
    time: 'Sun 8:30 AM', distance: '450m away',
    people: ['VK', 'NS'], extra: '2 joining',
    joined: false, week: 'This Sunday',
    colors: ['#1a3a20', '#3a2a1a'],
    textColors: ['#4ADE80', '#ffa726'],
  },
  {
    id: 3, title: 'Civil Lines Garden beautification',
    tag: { label: 'Park', cls: 'tag-green' },
    time: 'Sat 6:30 AM', distance: '800m away',
    people: ['RK', 'SP', 'DM'], extra: '+8 joining',
    joined: false, week: 'Next Weekend',
    colors: ['#1a2a3a', '#3a1a3a', '#3a1a1a'],
    textColors: ['#64b5f6', '#ce93d8', '#ef9a9a'],
  },
]

export default function DrivesScreen() {
  const [joined, setJoined] = useState({ 1: true, 2: false, 3: false })
  const [activeChip, setActiveChip] = useState('Near me')
  const chips = ['Near me', 'This week', 'Joined', 'Past']

  const weeks = [...new Set(drives.map(d => d.week))]

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="topbar-title">Cleanup drives</div>
          <div className="topbar-sub">3 near you this week</div>
        </div>
        <button className="btn-ghost" style={{ width: 'auto', padding: '7px 14px', fontSize: 12 }}>
          <Plus size={13} /> Plan drive
        </button>
      </div>

      <div className="filter-row">
        {chips.map(c => (
          <button key={c} className={`chip ${activeChip === c ? 'active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
        ))}
      </div>

      <div className="scroll">
        {weeks.map(week => (
          <div key={week}>
            <div className="sec-label">{week}</div>
            {drives.filter(d => d.week === week).map(drive => (
              <div key={drive.id} className="glass-card" style={{ margin: '0 20px 10px', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '12px 14px 8px' }}>
                  <span className={`tag ${drive.tag.cls}`} style={{ marginBottom: 6, display: 'inline-block' }}>{drive.tag.label}</span>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 5 }}>{drive.title}</div>
                  <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={10} />{drive.time}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={10} />{drive.distance}</span>
                  </div>
                </div>
                <div style={{ borderTop: '0.5px solid rgba(34,197,94,0.08)', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(34,197,94,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex' }}>
                      {drive.people.map((p, i) => (
                        <div key={p} style={{ width: 22, height: 22, borderRadius: '50%', border: '1.5px solid #0B0F0C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 500, marginLeft: i === 0 ? 0 : -5, background: drive.colors[i], color: drive.textColors[i] }}>{p}</div>
                      ))}
                    </div>
                    <span style={{ fontSize: 10, color: 'var(--text-dim)', marginLeft: 6 }}>{drive.extra}</span>
                  </div>
                  <button onClick={() => setJoined(j => ({ ...j, [drive.id]: !j[drive.id] }))} style={{ fontSize: 11, fontWeight: 500, color: joined[drive.id] ? '#4ADE80' : '#0B0F0C', background: joined[drive.id] ? 'rgba(34,197,94,0.1)' : '#22C55E', border: joined[drive.id] ? '0.5px solid rgba(34,197,94,0.2)' : 'none', borderRadius: 20, padding: '5px 14px', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {joined[drive.id] ? <><Check size={10} /> Joined</> : 'Join'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ margin: '4px 20px 0' }}>
          <button className="btn-ghost">
            <Plus size={14} /> Plan a new drive
          </button>
        </div>
      </div>
    </div>
  )
}
