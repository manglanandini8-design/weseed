import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export default function HotspotsScreen({ onBack }) {
  const [hotspots, setHotspots] = useState([])
const [loading, setLoading] = useState(true)
useEffect(() => {
  loadHotspots()
}, [])
const loadHotspots = async () => {
  try {
    const snapshot = await getDocs(collection(db, "reports"))

    const reports = snapshot.docs.map(doc => doc.data())

    const grouped = {}

    reports.forEach(report => {
      const place = report.location || "Unknown"

      grouped[place] = (grouped[place] || 0) + 1
    })

    const result = Object.entries(grouped)
      .map(([location, count]) => ({
        location,
        count
      }))
      .sort((a, b) => b.count - a.count)

    setHotspots(result)

  } finally {
    setLoading(false)
  }
}
  return (
    <div className="screen">

      <div className="topbar">

        <button
          className="icon-btn"
          onClick={onBack}
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <div className="topbar-title">
            Hotspots
          </div>

          <div className="topbar-sub">
            Areas with the highest civic issues
          </div>
        </div>

      </div>

      <div
        className="scroll"
        style={{
          padding: 20,
          color: "white"
        }}
      >
        {loading ? (

<div>
Loading hotspots...
</div>

) : (

hotspots.map((spot, index) => (

<div
key={spot.location}
className="glass-card"
style={{
marginBottom:16
}}
>

<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<div>

<div
style={{
fontWeight:600,
fontSize:15
}}
>
{spot.location}
</div>

<div
style={{
fontSize:12,
color:"var(--text-dim)"
}}
>
{spot.count} reports
</div>

</div>

<div
style={{
fontSize:28
}}
>
{spot.count >= 5
? "🔴"
: spot.count >= 3
? "🟠"
: "🟢"}
</div>

</div>

</div>

))

)}
      </div>

    </div>
  )
}