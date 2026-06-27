import { useState } from 'react'
import './index.css'
import StatusBar from './components/StatusBar'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import ReportScreen from './screens/ReportScreen'
import ReportsScreen from './screens/ReportsScreen'
import DrivesScreen from './screens/DrivesScreen'
import FeedScreen from './screens/FeedScreen'
import PlantScreen from './screens/PlantScreen'

export default function App() {
  const [tab, setTab] = useState('home')
  const [reporting, setReporting] = useState(false)
  const [showReports, setShowReports] = useState(false)

  const handleReport = () => setReporting(true)
  const handleBack = () => setReporting(false)
  const handleOpenReports = () => setShowReports(true)
const handleCloseReports = () => setShowReports(false)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#111', padding: '20px 0' }}>
      <div className="phone-shell">
        <StatusBar />

        {reporting ? (
          <ReportScreen onBack={handleBack} />
        ) : (
          <>
           {tab === 'home' && (
  <HomeScreen
    onReport={handleReport}
    onViewReports={handleOpenReports}
  />
)}
            {tab === 'reports' && <ReportsScreen />}
            {tab === 'drives' && <DrivesScreen />}
            {tab === 'feed' && <FeedScreen />}
            {tab === 'plant' && <PlantScreen onDrives={() => setTab('drives')} />}
          </>
        )}

        {!reporting && <BottomNav active={tab} onSwitch={setTab} />}
      </div>
    </div>
  )
}
