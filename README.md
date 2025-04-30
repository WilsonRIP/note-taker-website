# Note Taker Application

A modern, minimalist note-taking application built with Next.js, React, and TypeScript. This application supports rich text formatting, markdown, image uploads, drawing capabilities, and audio recording.

## Features

- **Rich Text Editing**
  - Text formatting (headings, bold, italic, lists)
  - Markdown support
  - Image and file attachments
  - Drawing and sketching capabilities
  - Audio recording for voice notes

- **Note Organization**
  - Tagging system
  - Search functionality
  - Note categorization

- **Clean UI/UX**
  - Minimalist design
  - Sidebar navigation (replaces traditional navbar)
  - Dark/light theme toggle
  - Responsive layout

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI (based on Radix UI)
- Bun (package manager and runtime)

## Getting Started

### Prerequisites

- Bun installed on your system. [Install Bun](https://bun.sh/docs/installation)

### Installation

1. Clone this repository
2. Install dependencies with Bun:

```bash
bun install
```

### Development

Run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

Create a production build:

```bash
bun run build
```

Start the production server:

```bash
bun run start
```

## Project Structure

- `/src/app`: Next.js app router pages and layouts
- `/src/components`: Reusable UI components
  - `/src/components/ui`: Base UI components
  - `/src/components/note-editor`: Rich text editor components
- `/src/lib`: Utility functions and shared code
- `/src/styles`: Global CSS styles

## Customization

The application is designed to be easily customizable:

- Edit `tailwind.config.ts` to modify colors, spacing, and other design variables
- Modify theme settings in `src/components/theme-provider.tsx`
- Adjust editor options in the note editor components

## License

MIT
