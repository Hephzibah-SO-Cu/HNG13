# Audiophile E-commerce Website (HNG Stage 3a)

This is a full-stack, pixel-perfect e-commerce website built as a submission for the HNG Stage 3a task. It features a complete shopping experience, from browsing products to a fully functional checkout with database persistence and email confirmations.

The application is built using Next.js (App Router), TypeScript, and Tailwind CSS on the frontend, with Convex as the backend for database and serverless functions, and Resend for handling transactional emails.

## Live Demo
[Link to the deployed application on Vercel/Netlify]

## Features
Fully Responsive Design: A pixel-perfect implementation of the Figma design across mobile, tablet, and desktop breakpoints.

Dynamic Pages: All category and product detail pages are dynamically rendered using Next.js dynamic routing and a centralized data store.

Global Cart Management: A persistent, site-wide cart state (built with React Context) that allows users to add, remove, and update item quantities.

Full Checkout Flow: A multi-step form with comprehensive client-side validation using react-hook-form and zod.

Persistent Backend: All successful orders are saved to a Convex database in real-time.

Transactional Emails: Automatic order confirmation emails are sent to the user upon successful checkout using a Convex action and the Resend API.

## Tech Stack
- Frontend: Next.js (App Router), React, TypeScript
- Styling: Tailwind CSS
- Backend & Database: Convex
- Form Management: React Hook Form
- Validation: Zod
- Email Service: Resend

## Getting Started
Follow these instructions to get the project running locally.

1. Prerequisites

Node.js (v18 or later)

An account with Convex

A free account with Resend

2. Clone the Repository

3. Install Dependencies

Install all required npm packages:

```bash
npm install
```

4. Link to Convex

Run the Convex "dev" command to link your local project to your Convex account.

``` bash
npx convex dev
```

Follow the prompts in your terminal. This will log you in and guide you to create a new project.

Once complete, npx convex dev will output your project's URL. Copy this URL. It will look like https://your-project-name.convex.cloud.

5. Configure Environment Variables

You must set variables in two separate places for the application to function.

## A. Local Frontend (.env.local)

Create a file named .env.local in the root of your project. This file is for your Next.js frontend.

Get this URL from the `npx convex dev` command
NEXT_PUBLIC_CONVEX_URL="[https://your-project-name.convex.cloud](https://your-project-name.convex.cloud)"


## B. Convex Dashboard (Backend)

Your Convex backend needs its own environment variables to send emails.

Go to your Convex project's dashboard.

Navigate to Settings > Environment Variables.

Add the following two variables:

Variable Name

Value

Notes

RESEND_API_KEY

re_...

Your API key from your Resend account.

CONVEX_URL

https://your-project-name.convex.cloud

The same URL from Step 4.

6. Run the Application

You will need two terminals running simultaneously.

Terminal 1 (Backend):
```bash
npx convex dev
```

(Leave this running. It syncs your database schema and functions.)

Terminal 2 (Frontend):
```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the live application.

Important Note on Email Submission

This project successfully integrates the Resend API for sending transactional emails.

Per Resend's free tier security policy, emails can only be sent to the single, verified email address associated with your Resend account (the email you used to sign up).

To Test: Complete the checkout process using your own verified Resend email address. The order will save to Convex, and you will receive a confirmation email.

Expected "Failure": If you use any other email address (e.g., test@gmail.com), the app will still work, the order will be saved, but Resend will return a 403 error in your terminal. This is the expected behavior for an unverified domain.

Production Path: To send emails to any user, a custom domain must be purchased and verified through the Resend dashboard.

## Submission Artifacts
Live Deployed App:

Confirmation Email Template: The HTML email template is located at email/ConfirmationEmail.tsx. (Note: The final implementation in convex/email.ts builds an HTML string for server-side compatibility, but this file serves as the required template).