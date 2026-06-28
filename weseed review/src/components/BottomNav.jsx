import { MapPin, Users, Image, Leaf } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Home', Icon: MapPin },
  { id: 'drives', label: 'Drives', Icon: Users },
  { id: 'feed', label: 'Feed', Icon: Image },
  { id: 'plant', label: 'My Plant', Icon: Leaf },
]

export default function BottomNav({ active, onSwitch }) {
  return (
    <nav className="bottom-nav">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${active === id ? 'active' : ''}`}
          onClick={() => onSwitch(id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}