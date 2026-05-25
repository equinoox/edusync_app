# EduSync

EduSync is an AI-powered web application for Micro-learning, designed to help students and professors manage learning materials, classrooms, quizzes, events, and AI-assisted studying in one place.

The application allows users to upload documents, use an AI chat assistant, organize classrooms, create quizzes, track progress, and receive important learning notifications.

> ⚠️ This project is still in development. Some features are experimental, incomplete, or subject to change.

---

## Features

- User authentication with Clerk
- Student and Professor roles
- AI-powered chat assistant
- Document upload and PDF parsing
- Retrieval-Augmented Generation for answering questions from uploaded materials
- Classroom management
- Quiz creation and quiz attempts
- Calendar events
- Student progress page
- Notification system
- Light and dark mode support
- Responsive UI built with Tailwind CSS

---

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Clerk
- Drizzle ORM
- PostgreSQL
- Vercel Blob
- Vercel AI SDK

---

## Architecture

EduSync follows a **Feature-Based Architecture**.

The project is organized around application features instead of technical layers only. Each major feature has its own folder and contains the logic, components, actions, services, schemas, and types related to that feature.

This makes the codebase easier to scale, maintain, and understand as the application grows.

---

## Project Structure

```txt
edusync_app/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/                # Backend API routes
│   ├── calendar/           # Calendar page
│   ├── chat/               # AI chat page
│   ├── classrooms/         # Classrooms page
│   ├── documents/          # Documents page
│   ├── home/               # Home page
│   ├── progress/           # Progress page
│   └── quizzes/            # Quizzes page
│
├── components/             # Shared UI and layout components
│
├── features/               # Feature-based application modules
│   ├── auth/               # Authentication and roles
│   ├── calendar/           # Calendar feature
│   ├── chat/               # AI chat feature
│   ├── classrooms/         # Classroom feature
│   ├── home/               # Home page feature
│   ├── notifications/      # Notifications feature
│   ├── progress/           # Progress feature
│   ├── quizzes/            # Quizzes feature
│   ├── resources/          # Learning resources and RAG logic
│   └── tokens/             # Token validation and usage logic
│
├── lib/                    # Shared utilities, AI logic and database setup
├── providers/              # Global React providers
├── public/                 # Static assets
├── drizzle.config.ts       # Drizzle configuration
├── middleware.ts           # Clerk middleware
└── package.json
