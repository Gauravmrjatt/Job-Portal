# Job Portal

A job board with two audiences: candidates who browse and apply to roles, and admins who manage companies, postings and applicants.

## Features

- **Candidate side** — browse jobs, filter listings, open a job description, apply
- **Admin side** — create and edit companies and job postings, review applicants per job
- **Auth** — login and signup with `bcryptjs` hashing and cookie-based sessions
- **API layer** — catch-all route handlers proxy to the backend service
- **File uploads** — Cloudinary integration for company logos and résumés
- **State** — Redux Toolkit for client state, Axios for requests
- **UI** — Tailwind CSS + Radix primitives (avatar, dialog, popover, select, radio group, label)

## Stack

Next.js (App Router) · React · Redux Toolkit · Axios · MongoDB · Cloudinary · Tailwind CSS · Radix UI

## Structure

```
app/
  admin/
    companies/          list · create · edit
    jobs/               list · create · applicants per job
  api/
    application/        proxy route handlers
    company/
    job/
    user/
  browse/               job browsing
  description/[id]/     job detail
  jobs/                 listings
  login/
```

## Getting started

```bash
npm install
```

Create `.env.local` (do not commit it) with your database, auth and Cloudinary credentials, then:

```bash
npm run dev
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Notes

- The package name is still `nextjs-temp` from the starter — rename it to `job-portal` for clarity.
