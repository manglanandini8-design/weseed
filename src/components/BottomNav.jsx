import { MapPin, Users, Image, Leaf } from 'lucide-react';

export default function BottomNav({ active, onSwitch }) {
  const tabs = [
    { id: 'home', label: 'Home', Icon: MapPin },
    { id: 'drives', label: 'Drives', Icon: Users },
    { id: 'feed', label: 'Feed', Icon: Image },
    { id: 'plant', label: 'My Plant', Icon: Leaf },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map(({ id, label, Icon }) => (
        <button
          key={id}
          className={`nav-item ${active === id ? 'active' : ''}`}
          onClick={() => onSwitch(id)}
        >
          <Icon size={20} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}