import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function ReportsScreen() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  loadReports();
}, []);

const loadReports = async () => {
  try {
    const snapshot = await getDocs(collection(db, "reports"));

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setReports(data);
  } catch (err) {
    console.error(err);
  } finally{
   setLoading(false);
  }
};

if (loading) {
return (<div className="screen">
      <div className="topbar">
        <div className="topbar-title">Community Reports</div>
      </div>
      
      <div
        style={{
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          height:"70%"
        }}
      >
        Loading reports...
      </div>
    </div>
  )
}
   <div className="topbar">
  <div>
    <div className="topbar-title">Community Reports</div>
    <div className="topbar-sub">
      Live reports submitted by nearby citizens
    </div>
  </div>
</div>
return (
     <div className="screen">

    <div className="topbar">
      ...
    </div>

    <div className="scroll"></div>
    {reports.map(report => (
      <div 
  key={report.id}
  className="glass-card"
  style={{
    margin:"0 20px 15px",
    padding:"16px"
  }}
>
<div
  style={{
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center"
  }}
>
    <h3>{report.tag}</h3>

    <span className={
report.severity === "Mild"
? "tag tag-green"
: report.severity === "Moderate"
? "tag tag-orange"
: "tag tag-red"
}
>
{report.severity}
    </span>
</div>

<p style={{color:"#9ca3af"}}>
    📍 {report.location || "Unknown location"}
</p>

<p style={{fontSize:12,color:"#4ADE80"}}>
    Submitted by community
    </p>
    {reports.length === 0 && (
<div
style={{
textAlign:"center",
padding:"60px",
color:"#888"
}}
>
No reports available 🌱
</div>
)}
      </div>
    ))}
  </div>
); 
}