Project: WeSeed

Goal:
A hyperlocal civic-tech platform where citizens report issues like garbage, potholes, dirty water, etc.

Tech Stack:
- React + Vite
- Firebase Firestore
- Firebase Storage
- Google Maps API
- Gemini AI

Current Flow:
1. User uploads photo.
2. Location is captured.
3. Gemini analyzes image.
4. Report saved to Firestore.
5. HomeScreen loads reports.
6. Reports shown as markers.
7. Nearby reports are grouped into hotspots.

Completed:
✔ Report submission
✔ Google Maps
✔ Firestore
✔ Hotspot grouping
✔ Severity scoring
✔ Responsive UI

Remaining:
- Firebase Storage upload
- Community Verification
- Dashboard
- Hotspot popup
- AI fallback if Gemini quota fails

Rules:
- Do not redesign UI.
- Do not change architecture.
- Do not rename files.
- Modify only files related to the requested feature.