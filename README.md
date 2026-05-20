# EduSync

EduSync is an AI-powered learning web application designed to help students learn more efficiently by using an AI assistant, study materials, and organized learning features.

The goal of the project is to provide students with a modern platform where they can upload or store learning resources, ask questions, receive explanations, and improve their studying process through AI-assisted learning.

> ⚠️ This project is still in development. Some features are incomplete, experimental, or subject to change.

## Features

- AI-powered chat assistant
- User authentication with Clerk
- Knowledge base support for storing and retrieving learning resources
- Retrieval-Augmented Generation logic for answering questions based on available materials
- Token usage validation and message length validation
- Modern landing page for EduSync
- Responsive UI built with Tailwind CSS
- Feature-based project structure
- Database integration with Drizzle ORM and PostgreSQL

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Clerk
- Vercel AI SDK
- Drizzle ORM
- PostgreSQL
- Zod
- shadcn/ui
- Heroicons
- Lucide React

## Project Structure

```txt
edusync_app/
├── app/                 # Next.js App Router pages and API routes
├── components/          # Shared UI components
├── features/            # Feature-based application modules
│   ├── chat/            # AI chat feature
│   ├── resources/       # Learning resources and retrieval logic
│   └── tokens/          # Token usage and validation logic
├── lib/                 # Shared libraries, database and AI utilities
├── providers/           # Global providers
├── public/              # Static assets
├── styles/              # Global and page-specific styles
├── middleware.ts        # Clerk middleware and route protection
├── drizzle.config.ts    # Drizzle ORM configuration
└── package.json
