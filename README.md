# 🌱 WeSeed — Clean Together

> *You don't have to clean alone.*
> 
> WeSeed is a hyperlocal civic-tech app that connects people who want to take action on cleanliness in their communities — but need the safety of a group to do it. Report dirty spots, join cleanup drives, and watch your plant grow with every contribution.

## 💭 Why I built this

Right outside my college there's a never ending line of garbage.
Every single day. Foul smell. Impossible to ignore.

I wanted to clean it up. I genuinely did.

But I didn't.

Not because I was lazy. Because I was scared. Scared that people 
would stare. Scared someone would laugh. Scared of that familiar 
feeling — log kya kahenge — even when I was trying to do something 
good.

And then I thought — what if I'm not the only one who feels this way?

What if there are hundreds of people in every city who have that same 
impulse, that same frustration, but hold back for the same reason — 
because nobody wants to look stupid doing the right thing alone?

That's what WeSeed is. Not an NGO. Not a government initiative. 
Just a way for people who already care to find each other — so 
nobody has to take the first step alone.

I'm a first-year BTech student. I didn't wait to have the perfect 
team, the perfect tech stack, or the perfect plan. I just started.

Because someone has to.

## 💡 The Problem

Most Indians feel frustrated by dirty public spaces. Many have even wanted to clean up — but held back. Not because they're lazy. Because of *log kya kahenge*. The fear of judgment stops real, willing people from acting.

WeSeed solves one thing: **you don't have to go first, alone.**

---

## 📱 Features (Prototype)

| Screen | What it does |
|--------|-------------|
| 🗺️ Home | Map view of dirty spots reported near you |
| 📸 Report | Photo upload + tag + severity + location |
| 🤝 Drives | Join or plan a cleanup drive at any reported spot |
| 🖼️ Feed | Before & after photos from real cleanups nearby |
| 🌱 My Plant | Gamified plant that grows with every contribution |

---

## 🌱 The Plant System

| Action | Reward |
|--------|--------|
| Report a spot | Seed planted |
| First drive joined | Sprout appears |
| 3 drives done | Small plant |
| 10 drives done | Flowering plant |
| 25 drives done | Full tree |

---

## 🛠️ Tech Stack

- React 18 + Vite
- React Router DOM
- Lucide React icons
- Dark mode UI (#0B0F0C base, green accent palette)

---

## 🚀 Run Locally

```bash
git clone https://github.com/yourusername/weseed.git
cd weseed
npm install
npm run dev
```

Open https://weseed.vercel.app

---

## 📂 Project Structure

```
weseed/
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx
│   │   ├── StatusBar.jsx
│   │   └── PlantSVG.jsx
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── ReportScreen.jsx
│   │   ├── DrivesScreen.jsx
│   │   ├── FeedScreen.jsx
│   │   └── PlantScreen.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── README.md
```

---

## 🗺️ Roadmap

- [ ] Google Maps API integration
- [ ] Firebase Auth
- [ ] Firestore database
- [ ] Push notifications
- [ ] React Native (Expo) mobile app
- [ ] Leaderboard by city and colony
- [ ] Instagram story share for plant

---

## 🙋 About

Built by a first-year BTech (AI & ML) student who got tired of waiting for someone else to fix it.

WeSeed — because the first step is always the hardest, and nobody should have to take it alone.

---

## 📄 License

MIT
