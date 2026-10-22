# Job Portal

A job board with two audiences. Candidates browse and apply. Admins manage companies, postings and the applicants who come in.

## What it does

- Browse and filter jobs, open a description, apply
- Admin console for companies and job postings
- Review applicants per job
- Login and signup with bcrypt hashing and cookie sessions
- Catch all route handlers proxy through to the backend
- Cloudinary for company logos and resumes
- Redux Toolkit for client state, Axios for requests

About 9,300 lines across 161 files: 8 models, 79 components.

## Stack

Next.js (App Router), React, Redux Toolkit, Axios, MongoDB, Cloudinary, Tailwind CSS, Radix UI.

## Layout

```
app/
  admin/
    companies/          list, create, edit
    jobs/               list, create, applicants
  api/
    application/        proxy handlers
    company/
    job/
    user/
  browse/
  description/[id]/
  jobs/
  login/
```

## Run it

```bash
npm install
```

Create `.env.local` (do not commit it) with your database, auth and Cloudinary credentials, then:

```bash
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the build |
| `npm run lint` | ESLint |

## Notes

The package name is still `nextjs-temp` from the starter. Renaming it to `job-portal` would save confusion later.
