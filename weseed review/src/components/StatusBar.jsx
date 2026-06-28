export default function StatusBar() {
  return (
    <div className="statusbar">
      <span>9:41</span>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <rect x="0" y="3" width="3" height="7" rx="1" fill="#3d5c42"/>
          <rect x="4" y="2" width="3" height="8" rx="1" fill="#3d5c42"/>
          <rect x="8" y="0" width="3" height="10" rx="1" fill="#3d5c42"/>
          <rect x="12" y="0" width="2" height="10" rx="1" fill="#22C55E"/>
        </svg>
      </span>
    </div>
  )
}
