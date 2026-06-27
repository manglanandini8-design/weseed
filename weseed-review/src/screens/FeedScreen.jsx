import { useState } from 'react'
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react'

const posts = [
  {
    id: 1,
    user: 'RS', name: 'Rajveer Singh', time: '2 hours ago',
    userBg: '#1a4a20', userColor: '#4ADE80',
    beforeBg: '#2a1010', beforeColor: '#ef5350',
    afterBg: '#0d2a12', afterColor: '#4ADE80',
    caption: 'Cleaned up the garbage pile near Model Town Park gate. Took 7 of us and 45 mins. Worth it!',
    likes: 38, comments: 12, dist: '200m',
  },
  {
    id: 2,
    user: 'AK', name: 'Ananya Kapoor', time: 'Yesterday',
    userBg: '#1a2a4a', userColor: '#64b5f6',
    beforeBg: '#2a1a08', beforeColor: '#ffa726',
    afterBg: '#0d2a12', afterColor: '#4ADE80',
    caption: 'Civil Lines Garden is unrecognisable. 11 people showed up at 6:30 AM on a Saturday. This is what we can do.',
    likes: 91, comments: 24, dist: '800m',
  },
  {
    id: 3,
    user: 'VK', name: 'Vikram Kumar', time: '3 days ago',
    userBg: '#3a1a20', userColor: '#f48fb1',
    beforeBg: '#2a1a10', beforeColor: '#ffa726',
    afterBg: '#0d2210', afterColor: '#4ADE80',
    caption: 'Small win but still a win — cleaned the alley behind our colony. 4 of us. 30 minutes. One bag of trash.',
    likes: 54, comments: 8, dist: '1.2km',
  },
]

export default function FeedScreen() {
  const [liked, setLiked] = useState({})
  const [activeChip, setActiveChip] = useState('Near me')
  const chips = ['Near me', 'My drives', 'This month']

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="topbar-title">Before & after</div>
          <div className="topbar-sub">Real cleanups near you</div>
        </div>
      </div>

      <div className="filter-row">
        {chips.map(c => (
          <button key={c} className={`chip ${activeChip === c ? 'active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
        ))}
      </div>

      <div className="scroll">
        {posts.map(post => (
          <div key={post.id} className="glass-card" style={{ margin: '0 20px 12px', padding: 0, overflow: 'hidden' }}>
            {/* Before / After images */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <div style={{ height: 90, background: post.beforeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: post.beforeColor }}>Before</div>
              <div style={{ height: 90, background: post.afterBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500, color: post.afterColor }}>After ✓</div>
            </div>

            <div style={{ padding: '10px 12px' }}>
              {/* User row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: post.userBg, color: post.userColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, flexShrink: 0 }}>{post.user}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#86EFAC' }}>{post.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{post.time}</div>
                </div>
              </div>

              {/* Caption */}
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{post.caption}</p>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: liked[post.id] ? '#ef5350' : 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Heart size={14} fill={liked[post.id] ? '#ef5350' : 'none'} /> {post.likes + (liked[post.id] ? 1 : 0)}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <MessageCircle size={14} /> {post.comments}
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <Share2 size={14} />
                </button>
                <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: '#2d4a32' }}>
                  <MapPin size={10} /> {post.dist}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
