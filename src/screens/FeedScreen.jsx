import { useState } from 'react'
import { Heart, MessageCircle, Share2, MapPin } from 'lucide-react'

const ALL_POSTS = [
  {
    id: 1,
    user: 'RS', name: 'Rajveer Singh', time: '2 hours ago',
    userBg: '#1a4a20', userColor: '#4ADE80',
    beforeLabel: 'Overflowing bin', afterLabel: 'Cleared ✓',
    beforeEmoji: '🗑️', afterEmoji: '✨',
    beforeBg: 'linear-gradient(135deg, #2a1010, #1a0a0a)',
    afterBg: 'linear-gradient(135deg, #0d2a12, #0a1a0d)',
    beforeColor: '#ef5350', afterColor: '#4ADE80',
    caption: 'Cleaned up the garbage pile near Model Town Park gate. Took 7 of us and 45 mins. Worth it!',
    likes: 38, comments: 12, dist: '200m',
    tag: 'Near me', month: true, myDrive: false,
  },
  {
    id: 2,
    user: 'AK', name: 'Ananya Kapoor', time: 'Yesterday',
    userBg: '#1a2a4a', userColor: '#64b5f6',
    beforeLabel: 'Littered park', afterLabel: 'Restored ✓',
    beforeEmoji: '🚯', afterEmoji: '🌳',
    beforeBg: 'linear-gradient(135deg, #2a1a08, #1a1005)',
    afterBg: 'linear-gradient(135deg, #0d2a12, #0a1809)',
    beforeColor: '#ffa726', afterColor: '#4ADE80',
    caption: 'Civil Lines Garden is unrecognisable. 11 people showed up at 6:30 AM on a Saturday. This is what we can do.',
    likes: 91, comments: 24, dist: '800m',
    tag: 'Near me', month: true, myDrive: true,
  },
  {
    id: 3,
    user: 'VK', name: 'Vikram Kumar', time: '3 days ago',
    userBg: '#3a1a20', userColor: '#f48fb1',
    beforeLabel: 'Dirty alley', afterLabel: 'Clean ✓',
    beforeEmoji: '🤢', afterEmoji: '🧹',
    beforeBg: 'linear-gradient(135deg, #2a1a10, #1a1008)',
    afterBg: 'linear-gradient(135deg, #0d2210, #091507)',
    beforeColor: '#ffa726', afterColor: '#4ADE80',
    caption: 'Small win but still a win — cleaned the alley behind our colony. 4 of us. 30 minutes. One bag of trash.',
    likes: 54, comments: 8, dist: '1.2km',
    tag: 'Near me', month: false, myDrive: false,
  },
]

export default function FeedScreen() {
  const [liked, setLiked] = useState({})
  const [activeChip, setActiveChip] = useState('Near me')
  const chips = ['Near me', 'My drives', 'This month']

  const filteredPosts = ALL_POSTS.filter(p => {
    if (activeChip === 'My drives') return p.myDrive;
    if (activeChip === 'This month') return p.month;
    return true; // Near me = all
  });

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="topbar-title">Before & After</div>
          <div className="topbar-sub">Real cleanups near you</div>
        </div>
      </div>

      <div className="filter-row">
        {chips.map(c => (
          <button key={c} className={`chip ${activeChip === c ? 'active' : ''}`} onClick={() => setActiveChip(c)}>{c}</button>
        ))}
      </div>

      <div className="scroll">
        {filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div>
            No posts yet for this filter
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="glass-card" style={{ margin: '0 20px 12px', padding: 0, overflow: 'hidden' }}>
              {/* Before / After grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ height: 110, background: post.beforeBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 8, left: 8, fontSize: 9, fontWeight: 600, color: post.beforeColor, background: `${post.beforeColor}15`, border: `0.5px solid ${post.beforeColor}30`, padding: '2px 7px', borderRadius: 10 }}>BEFORE</div>
                  <span style={{ fontSize: 28 }}>{post.beforeEmoji}</span>
                  <span style={{ fontSize: 10, color: post.beforeColor, fontWeight: 500 }}>{post.beforeLabel}</span>
                </div>
                <div style={{ height: 110, background: post.afterBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, position: 'relative', borderLeft: '1px solid rgba(0,0,0,0.2)' }}>
                  <div style={{ position: 'absolute', top: 8, right: 8, fontSize: 9, fontWeight: 600, color: post.afterColor, background: `${post.afterColor}15`, border: `0.5px solid ${post.afterColor}30`, padding: '2px 7px', borderRadius: 10 }}>AFTER</div>
                  <span style={{ fontSize: 28 }}>{post.afterEmoji}</span>
                  <span style={{ fontSize: 10, color: post.afterColor, fontWeight: 500 }}>{post.afterLabel}</span>
                </div>
              </div>

              <div style={{ padding: '12px 14px 10px' }}>
                {/* User row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: post.userBg, color: post.userColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, flexShrink: 0, border: `1px solid ${post.userColor}30` }}>{post.user}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#86EFAC' }}>{post.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>{post.time}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--text-dim)' }}>
                    <MapPin size={9} /> {post.dist}
                  </div>
                </div>

                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>{post.caption}</p>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '0.5px solid rgba(255,255,255,0.04)', paddingTop: 8 }}>
                  <button
                    onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: liked[post.id] ? '#ef5350' : 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'color 0.15s ease' }}>
                    <Heart size={14} fill={liked[post.id] ? '#ef5350' : 'none'} /> {post.likes + (liked[post.id] ? 1 : 0)}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <MessageCircle size={14} /> {post.comments}
                  </button>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <Share2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}
