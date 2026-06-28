# 🌱 WeSeed — Clean Together

> **You don't have to clean alone.**

WeSeed is an AI-powered civic-tech platform that helps citizens report environmental issues, discover community hotspots, and organize local cleanup drives. It combines crowdsourced reporting, intelligent mapping, and community participation to make neighborhoods cleaner together.

**Live Demo:** https://weseed.vercel.app

---

# 💭 Why I Built WeSeed

Right outside my college is a stretch of road that's almost always covered in garbage.

Every day I walked past it thinking, *someone should clean this.*

Many times I wanted to.

But I never did.

Not because I didn't care.

Because I was afraid.

Afraid people would stare.
Afraid someone would laugh.
Afraid of that familiar thought:

**"Log kya kahenge?"**

Then I realized something.

Maybe thousands of people feel exactly the same.

People who genuinely care, but don't want to be the only one picking up trash in public.

That realization became WeSeed.

Not another NGO.
Not another complaint app.

A platform where people who already care can find each other and take action together.

Because the hardest part isn't cleaning.

It's taking the first step alone.

---

# 🌍 The Problem

Cities receive thousands of complaints every year, yet many local environmental issues remain unresolved.

At the same time, citizens who genuinely want to help often hesitate because they feel uncomfortable acting alone.

WeSeed bridges that gap by connecting people, highlighting problem areas, and encouraging collective action.

---

# ✨ Features

## 🗺️ Smart Community Map

* Live Google Maps integration
* Nearby environmental reports
* User location detection
* Interactive report markers

---

## 📸 Report an Issue

Users can report:

* Garbage dumps
* Potholes
* Dirty water
* Littering
* Streetlight issues
* Other civic problems

Each report stores:

* GPS location
* Photo
* Severity
* Description
* Timestamp

---

## 🔥 Hotspot Detection

One of WeSeed's core features.

The application automatically:

* Groups nearby reports
* Detects recurring issues
* Calculates hotspot severity
* Displays color-coded hotspot circles

This allows users to immediately identify the areas needing the most attention.

---

## 🤖 AI Assisted Analysis

When available, Gemini AI analyzes uploaded images to identify:

* Issue type
* Severity
* Risk level
* Responsible authority
* Recommended action
* Confidence level

If AI is unavailable, reports are still stored and remain visible to the community.

---

## 📄 Community Reports

Browse all reports submitted by nearby citizens.

Each report includes:

* Photo
* Issue category
* Severity
* Status
* AI analysis (when available)
* Community upvotes

---

## 🤝 Cleanup Drives

Citizens can organize or join local cleanup drives around reported hotspots, encouraging people to work together instead of acting alone.

---

## 🌱 Gamification

Every contribution helps your virtual plant grow.

| Action             | Reward             |
| ------------------ | ------------------ |
| Report first issue | 🌱 Seed            |
| Join first drive   | 🌿 Sprout          |
| Complete 3 drives  | 🪴 Small Plant     |
| Complete 10 drives | 🌸 Flowering Plant |
| Complete 25 drives | 🌳 Full Tree       |

---

# 🛠 Tech Stack

### Frontend

* React 18
* Vite
* JavaScript
* CSS

### Maps

* Google Maps JavaScript API
* @react-google-maps/api

### Backend

* Firebase Firestore
* Firebase Storage (planned)

### AI

* Google Gemini API

### UI

* Lucide React Icons
* Glassmorphism
* Dark Theme

---

# 🚀 Getting Started

```bash
git clone https://github.com/yourusername/weseed.git

cd weseed

npm install

npm run dev
```

Open:

https://weseed.vercel.app

---

# 📂 Project Structure

```
src/
│
├── components/
│   ├── BottomNav.jsx
│   ├── StatusBar.jsx
│   └── PlantSVG.jsx
│
├── screens/
│   ├── HomeScreen.jsx
│   ├── ReportScreen.jsx
│   ├── ReportsScreen.jsx
│   ├── HotspotsScreen.jsx
│   ├── DrivesScreen.jsx
│   ├── FeedScreen.jsx
│   └── PlantScreen.jsx
│
├── firebase.js
├── App.jsx
├── main.jsx
└── index.css
```

---

# 🚧 Roadmap

* [x] Google Maps integration
* [x] Firebase Firestore
* [x] Live report markers
* [x] Hotspot detection
* [x] Community reports
* [ ] Firebase Authentication
* [ ] Firebase Storage for image uploads
* [ ] Push notifications
* [ ] AI-powered hotspot prioritization
* [ ] Leaderboards
* [ ] React Native mobile application
* [ ] Municipal authority dashboard
* [ ] Before/After cleanup verification

---

# 🎯 Vision

Imagine opening a map and instantly knowing:

* where garbage is accumulating,
* which areas urgently need attention,
* who nearby is willing to help,
* and how a small community can solve local problems together.

That's the future WeSeed is building.

---

# 👩‍💻 About

Built by **Nandini Mangla**, a B.Tech Artificial Intelligence & Machine Learning student, to prove that technology can help communities take the first step toward cleaner neighborhoods.

---

# 📄 License

MIT License
