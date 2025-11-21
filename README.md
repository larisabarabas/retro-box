# **Retro Box — MVP**

Retro Box is a lightweight retrospective tool that helps product and engineering teams collect notes during the sprint and review them together at the end of the cycle. It keeps feedback organized, reduces meeting overhead, and builds stronger team awareness over time.

---

## 🚀 **Features**

* **Team Spaces** — each team gets its own Retro Box.
* **Contributor Role by Default** — new users can add notes immediately.
* **Add Notes Anytime** — during the sprint or within a defined time window.
* **Retro Categories** — "Went Well", "Didn't Go Well", "Ideas", and more (configurable).
* **Auto-Categorization (Optional)** — uses OpenAI to group notes or clean duplicates.
* **Review View** — clean UI for reading, grouping, and discussing notes.
* **History** — see past retros for context and progress (MVP-basic).

---

## 🧱 **Tech Stack**

### **Frontend**

* Next.js (App Router)
* TypeScript
* TailwindCSS + ShadCN UI
* Zustand (minimal state)
* API Routes for backend logic
* Optional realtime via Liveblocks or Supabase Realtime

### **Backend**

* Supabase (Auth, Database, RLS)
* Postgres for storing teams, users, and notes
* Optional: Supabase Edge Functions for scheduled jobs

### **AI**

* OpenAI GPT-4 Mini or GPT-4o Mini for note categorization

---

## 📦 **Local Development**

```bash
git clone <repo-url>
cd retro-box
npm install
npm run dev
```

Environment variables required:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

---

## 📂 **Project Structure**

```
app/
  (routes)
  store/
  api/
  types/
  styles/
components/
lib/
```

---

## 📄 **License**

MIT License.

---
