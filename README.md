<div align="center">

# 🩺 MedBro
### AI-Powered Voice Medical Assistant

**Talk to a doctor. No appointments. No waiting rooms.**

[![Live Demo](https://img.shields.io/badge/Live%20App-medbro--puce.vercel.app-brightgreen?style=for-the-badge&logo=vercel)](https://medbro-puce.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Live%20%26%20Active-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)]()

</div>

---

## What is MedBro?

MedBro is a voice-first AI medical assistant that lets you consult specialist AI doctors through natural conversation — no typing, no forms, no wait times. Just speak, and get intelligent, context-aware medical guidance in real time.

> ⚠️ **Disclaimer:** MedBro is an AI assistant for informational purposes only and does not replace professional medical advice, diagnosis, or treatment.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🎤 **Voice Consultation** | Real-time voice interaction — no typing needed |
| 👨‍⚕️ **Multiple Specialists** | General Physician (free), Cardiologist, Dermatologist & more |
| 🧠 **Intelligent Responses** | Context-aware conversations with symptom follow-ups |
| 📊 **Session History** | View past consultations with AI-generated summaries |
| 🔐 **Secure Auth** | Login/signup powered by Clerk |
| 🌍 **Multilingual** *(Coming Soon)* | English + Hindi voice support |

---

## 🛠️ Tech Stack
```

Frontend   → Next.js 15, React, Tailwind CSS
Backend    → Next.js API Routes
Database   → Neon (PostgreSQL) + Drizzle ORM
Auth       → Clerk
AI / Voice → OpenAI + Vapi + ElevenLabs
Deployment → Vercel
```

---

## 🔄 How It Works
```

1. Sign in → 2. Pick a doctor → 3. Start voice consultation
       ↓
4. AI listens & responds in real time
       ↓
5. Session is saved → 6. View your report & history
```

---

## 🚀 Getting Started
```bash
# Clone the repo
git clone https://github.com/your-username/medbro.git
cd medbro

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your API keys (Clerk, OpenAI, Vapi, ElevenLabs, Neon DB)

# Run locally
npm run dev
```

> **Required environment variables:**
> `CLERK_SECRET_KEY`, `OPENAI_API_KEY`, `VAPI_API_KEY`, `ELEVENLABS_API_KEY`, `DATABASE_URL`

---

## 🗺️ Roadmap

- [x] Core voice consultation experience
- [x] Multiple AI doctor agents
- [x] Session history & AI-generated reports
- [x] Secure authentication
- [ ] Premium plans for specialist access
- [ ] Full multilingual voice support (Hindi, etc.)
- [ ] Health analytics dashboard
- [ ] Personalized doctor recommendations
- [ ] Mobile-first optimized UI

---

## 👤 Author

**Udit Jain** — Building AI-first products 🚀

[![GitHub](https://img.shields.io/badge/GitHub-uditjainofficial-black?style=flat-square&logo=github)](https://github.com/uditjainofficial)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-uditjainofficial-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/uditjainofficial)
[![Email](https://img.shields.io/badge/Email-work.uditjain%40gmail.com-D14836?style=flat-square&logo=gmail)](mailto:work.uditjain@gmail.com)

---

## ⭐ Support

Found MedBro useful or interesting? **Give it a star** — it helps more people discover it!

[![Star on GitHub](https://img.shields.io/github/stars/your-username/medbro?style=social)](https://github.com/your-username/medbro)
