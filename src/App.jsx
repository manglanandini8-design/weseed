import { useState } from 'react'
import './index.css'
import StatusBar from './components/StatusBar'
import BottomNav from './components/BottomNav'
import HomeScreen from './screens/HomeScreen'
import ReportScreen from './screens/ReportScreen'
import ReportsScreen from './screens/ReportsScreen'
import DrivesScreen, { PlanDriveScreen } from './screens/DrivesScreen'
import FeedScreen from './screens/FeedScreen'
import PlantScreen from './screens/PlantScreen'
import HotspotsScreen from './screens/HotspotsScreen'

export default function App() {
  const [tab, setTab] = useState('home')
  const [reporting, setReporting] = useState(false)
  const [showReports, setShowReports] = useState(false)
  const [showHotspots, setShowHotspots] = useState(false)
  const [planningDrive, setPlanningDrive] = useState(false)
  const [plannedDrive, setPlannedDrive] = useState(null)

  const handleReport = () => setReporting(true)
  const handleBack = () => setReporting(false)
  const handleOpenReports = () => setShowReports(true)
  const handleCloseReports = () => setShowReports(false)
  const handleOpenHotspots = () => setShowHotspots(true)
  const handleCloseHotspots = () => setShowHotspots(false)
  const handleOpenPlanDrive = () => setPlanningDrive(true)
  const handleClosePlanDrive = () => setPlanningDrive(false)
  const handleDriveSubmit = (form) => {
    setPlannedDrive(form)
    setPlanningDrive(false)
  }

  return (
    // No inline layout styles here — body/#root in index.css owns centering
    <div className="phone-shell">
      <StatusBar />

      {reporting ? (
        <ReportScreen onBack={handleBack} />
      ) : showReports ? (
        <ReportsScreen onBack={handleCloseReports} />
      ) : showHotspots ? (
        <HotspotsScreen onBack={handleCloseHotspots} />
      ) : planningDrive ? (
        <PlanDriveScreen
          onBack={handleClosePlanDrive}
          onSubmit={handleDriveSubmit}
        />
      ) : (
        <>
          {tab === 'home' && <HomeScreen onReport={handleReport} onViewReports={handleOpenReports} onViewHotspots={handleOpenHotspots} />}
          {tab === 'drives' && (
            <DrivesScreen
              onPlanDrive={handleOpenPlanDrive}
              plannedDrive={plannedDrive}
            />
          )}
          {tab === 'feed' && <FeedScreen />}
          {tab === 'plant' && <PlantScreen onDrives={() => setTab('drives')} />}
        </>
      )}

      {!reporting && !showReports && !showHotspots && !planningDrive && (
        <BottomNav active={tab} onSwitch={setTab} />
      )}
    </div>
  )
}
