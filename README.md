# HireFlow

HireFlow is a modern job board application built with Next.js, React, TypeScript, Tailwind CSS, and Supabase.

The platform allows users to browse available job opportunities, view job details, create an account, sign in, and submit job applications through a clean and responsive interface.

## Live Demo

[Open HireFlow](https://hire-flow-pi-roan.vercel.app/)

## GitHub Repository

[View HireFlow on GitHub](https://github.com/AbhinayYasa/HireFlow)

---

## Features

### Job Board

- Browse available job opportunities.
- View job title, company, location, employment type, salary, and required skills.
- Job information is retrieved from Supabase.
- Responsive job listing interface.

### Job Details

Users can select a job to view relevant information before applying.

Job details include:

- Job title
- Company
- Location
- Job type
- Salary
- Required skills

### User Authentication

HireFlow uses Supabase Authentication for user sign-in.

Users can:

- Create an account.
- Sign in using email and password.
- Sign out.
- Access the application form after successful authentication.

If a user attempts to apply without being signed in, HireFlow displays the sign-in interface before allowing the application process to continue.

### Job Application

Authenticated users can submit applications for available jobs.

The application form collects:

- Full name
- Email
- Phone number
- Resume
- LinkedIn profile
- Cover letter

After a successful submission, HireFlow displays an application confirmation message.

### Application Information

Application records contain information such as:

- Applicant details
- Job details
- Company
- Location
- Job type
- Salary
- Skills
- Resume
- LinkedIn profile
- Cover letter
- Application status

### Responsive User Experience

The interface is designed with a clean and responsive layout.

The application uses:

- Responsive layouts
- Job cards
- Modal dialogs
- Forms
- Buttons
- Responsive grids
- Clear authentication flows
- Application confirmation states

---

## Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend and Database

- Supabase
- Supabase Authentication
- PostgreSQL

### Development Tools

- Visual Studio Code
- Git
- GitHub
- GitHub Actions

### Deployment

- Vercel

---

## Supabase Integration

Supabase provides the backend services used by HireFlow.

The `jobs` table contains the job opportunities displayed on the job board.

The Supabase browser client is configured in:

```text
lib/supabase/client.ts