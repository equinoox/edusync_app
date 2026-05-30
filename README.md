# EduSync

## EduSync Link: https://edusyncappv.vercel.app/

**EduSync** is an AI-powered micro-learning web application designed for students and professors. It brings learning materials, AI-assisted studying, classrooms, quizzes, progress tracking, calendar events, and notifications into one focused platform.

The project is currently released as **Version 1.0.0**.  
It is a finished early-stage version, meaning the core functionality is implemented and usable, while future improvements, optimizations, and additional features are planned.

---

## Overview

EduSync helps users organize and improve the learning process through a modern educational dashboard.

Students can upload and review learning documents, chat with an AI assistant, take quizzes, follow classroom updates, track their progress, and manage upcoming learning events.

Professors can manage classrooms, add students, assign materials, create quizzes, schedule events, and notify students about important updates.

---

## Features

### Core Learning Tools

- AI chat assistant
- PDF document upload and parsing
- Document-based AI responses
- Quiz creation and quiz attempts
- Student progress tracking

### Classroom Management

- Student and Professor roles
- Classroom creation and management
- Classroom documents, quizzes, and events
- Student enrollment management

### User Experience

- Calendar for learning events
- Notification system
- Light and dark mode
- Responsive dashboard interface

---

## Tech Stack

### Frontend

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- Heroicons
- React Markdown
- Sonner

### Backend and Database

- Next.js App Router API routes
- PostgreSQL
- Drizzle ORM
- Drizzle Kit
- Zod
- Clerk Authentication

### AI and Storage

- Vercel AI SDK
- AI SDK React
- Vercel Blob
- PDF parsing with `unpdf`
- Retrieval-based document workflow

### Development Tools

- ESLint
- TypeScript
- TSX
- PostCSS
- pnpm

---

## Architecture

EduSync follows a **Feature-Based Architecture**.

Instead of organizing the application only by technical layers, the codebase is structured around real application features. Each major feature contains its own components, server logic, actions, schemas, services, and types where needed.

This makes the application easier to understand, scale, and maintain as the project grows.

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
│   ├── home/               # Home dashboard
│   ├── progress/           # Progress page
│   └── quizzes/            # Quizzes page
│
├── components/             # Shared UI and layout components
├── features/               # Feature-based application modules
│   ├── auth/               # Authentication and role logic
│   ├── calendar/           # Calendar feature
│   ├── chat/               # AI chat feature
│   ├── classrooms/         # Classroom feature
│   ├── documents/          # Document upload and document management
│   ├── home/               # Home page feature
│   ├── notifications/      # Notification feature
│   ├── progress/           # Student progress feature
│   ├── quizzes/            # Quiz feature
│   ├── resources/          # Learning resources and retrieval logic
│   └── tokens/             # Token validation and usage logic
│
├── lib/                    # Shared utilities, AI logic, and database setup
├── providers/              # Global React providers
├── public/                 # Static assets
├── drizzle.config.ts       # Drizzle configuration
├── middleware.ts           # Clerk middleware
└── package.json
