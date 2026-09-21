# RoomRelay

**Verified student-to-student temporary subletting for Maastricht**

Built for the **MAIN × SpaceX AI Hackathon** — Maastricht, 21 September 2026.

---

## The problem

In university cities like Maastricht, many students leave temporarily for exchanges, internships, or holidays but keep paying for an empty room. At the same time, incoming students struggle to find short-term accommodation that matches their dates and budget.

## The solution

**RoomRelay** is a verified student-only marketplace where outgoing students can list their room for a fixed period, and incoming students can search by dates, area, and price.

What makes RoomRelay different is **trust**:
- only verified Maastricht University students can access key flows
- listings show clear permission and trust status
- users can upload a rental agreement and get an **AI-assisted contract check** that highlights subletting clauses, permission requirements, restrictions, and suggested next steps

> The contract checker provides **analysis, not legal advice**.

---

## Hackathon track

RoomRelay is primarily built for the **Maastricht Challenge**, with clear startup potential for other university cities.

---

## Demo flow (for judges)

Try this end-to-end story in a few minutes:

1. **Homepage** — `/`  
   See the product pitch and how RoomRelay works.

2. **Browse rooms** — `/listings`  
   Filter by area, price, and dates. Open any listing for details.

3. **Verify as a student** — `/verify`  
   Sign in with a Maastricht University email (`@maastrichtuniversity.nl` or `@student.maastrichtuniversity.nl`).  
   You will receive a one-time code by email.

4. **List a room** — `/list-room`  
   - Add room details and choose a demo photo or upload your own cover photo  
   - Set availability dates  
   - Upload a rental agreement PDF  
   - Run the **AI contract check**  
   - Generate a landlord permission request  
   - Simulate approval and publish the listing

5. **See your listing live** — `/listings`  
   Your published listing appears in the marketplace and survives page refresh (stored in the browser for this MVP).

---

## Key features

- Verified student access (Maastricht University email + OTP)
- Date-based marketplace search and filters
- Listing detail pages with trust and permission badges
- Multi-step “List your room” flow
- Real AI contract analysis (Google Gemini)
- Landlord permission request draft
- Realistic listing photos + optional personal cover photo upload
- Polished, mobile-friendly UI built for a live demo

---

## Tech stack

- **Next.js 16** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS**
- **Google Gemini** — rental agreement analysis
- **Resend** — student email verification codes
- **localStorage** — user-created listings (hackathon MVP persistence)

---

## Getting started

### Requirements

- Node.js 20+ (22 recommended)
- npm

### 1. Clone the repo

```bash
git clone https://github.com/danimarcos10/MainxSpaceXHackathon.git
cd MainxSpaceXHackathon
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a file named `.env.local` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```

| Variable | Required for | Notes |
|---|---|---|
| `GEMINI_API_KEY` | AI contract check | Needed to analyze uploaded rental PDFs |
| `RESEND_API_KEY` | Student email verification | Needed to send OTP codes on `/verify` |

Without these keys, the rest of the app still runs, but those specific features will show an error.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Production build (optional)

```bash
npm run build
npm run start
```

---

## Useful routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/listings` | Marketplace with filters |
| `/listings/[id]` | Listing detail + booking request |
| `/list-room` | Publish a room (requires verification) |
| `/verify` | Maastricht University email verification |
| `/api/ai/contract-check` | AI rental agreement analysis |
| `/api/auth/*` | Email verification API |

---

## Project structure

```text
src/
  app/                 # Pages and API routes
  components/          # UI and feature components
  lib/                 # Demo data, AI helpers, storage, image upload
  types/               # Shared TypeScript types
```

---

## MVP scope (intentional)

This is a **hackathon MVP**, optimized for a clear demo rather than production infrastructure:

- listings created in the browser are saved locally (not in a shared database)
- landlord approval can be simulated for the demo flow
- contract analysis is AI-assisted guidance, not legal advice

The goal is to show one complete, believable student subletting journey from listing to search to trust checks.

---

## Team / repository

- GitHub: [danimarcos10/MainxSpaceXHackathon](https://github.com/danimarcos10/MainxSpaceXHackathon)

---

## License

Hackathon project — see repository for usage details.
