# MSU Global Buddy+

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?style=flat-square&logo=capacitor)
![Android](https://img.shields.io/badge/Android-APK-3DDC84?style=flat-square&logo=android)
![License](https://img.shields.io/badge/License-All%20Rights%20Reserved-red?style=flat-square)

> Mobile app connecting international students at **Montclair State University** —
> find study buddies, join events, chat, and navigate campus life together.

---

## 📱 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth** | Register & login with profile setup (country, program, languages, interests) |
| 🤝 **Buddy Matching** | Smart matching based on shared languages, interests & program |
| 💬 **Chat** | Real-time messaging with matched buddies |
| 📅 **Events** | Browse, RSVP, and track campus events |
| 📚 **Resources** | Student resources and campus guides |
| 🏆 **Achievements** | Gamified badges for app engagement |
| 🔔 **Notifications** | Match alerts and activity notifications |
| 🎓 **University** | MSU campus info and directory |

---

## 🏗️ Architecture

```
src/
├── App.tsx                     # Main navigator + state machine
├── components/
│   ├── SplashScreen.tsx        # Animated launch screen
│   ├── OnboardingScreens.tsx   # 3-step onboarding
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   ├── ProfileSetup.tsx        # Languages, interests, photo
│   ├── HomeScreen.tsx          # Dashboard
│   ├── FindingBuddyScreen.tsx  # Matching animation
│   ├── BuddyFoundScreen.tsx    # Match result
│   ├── ChatScreen.tsx          # 1-on-1 chat
│   ├── EventsScreen.tsx        # Campus events
│   ├── ResourcesScreen.tsx     # Student resources
│   ├── MatchesScreen.tsx       # All matches
│   ├── ProfilePage.tsx         # User profile
│   ├── AchievementsPage.tsx    # Badges & milestones
│   └── ui/                     # shadcn/ui components
├── utils/
│   ├── userStorage.ts          # User persistence
│   ├── eventsStorage.ts        # Events & RSVP
│   └── notificationsStorage.ts
android/                        # Capacitor Android wrapper
```

---

## 🚀 Run Locally

```bash
npm install
npm run dev
# Open http://localhost:5173
```

## 📦 Build Android APK

```bash
npm run build
npx cap sync android
npx cap open android
# Build → Generate Signed APK in Android Studio
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript + Vite |
| Mobile | Capacitor 8 (Android) |
| UI | shadcn/ui + Radix UI |
| Animations | Motion/React |
| Styling | Tailwind CSS |
| Storage | localStorage |

---

## Author

**Aboubacar Sidick Meite** — [@ApollonIUGB77](https://github.com/ApollonIUGB77)
M.S. Cybersecurity · Montclair State University

---

© 2026 Aboubacar Sidick Meite (ApollonIUGB77) — All Rights Reserved

  This is a code bundle for Msu Global Buddy+ App. The original project is available at https://www.figma.com/design/uBNnACtVg2NJDTHg0TGGCB/Msu-Global-Buddy--App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  