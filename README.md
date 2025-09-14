# Blog Starter App

A modern, TypeScript-powered blog application built with Next.js 15, featuring static site generation, Markdown support, and a beautiful responsive design.

## Features

- 🚀 **Next.js 15** with App Router
- 📝 **Markdown Support** for blog posts
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design** 
- 🌙 **Dark/Light Theme** support
- ⚡ **Static Site Generation** for optimal performance
- 🔍 **SEO Optimized**
- 📊 **TypeScript** for type safety

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Content**: Markdown with front matter
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd blog-starter-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── _articles/          # Article data (JSON format)
├── _posts/             # Markdown blog posts
├── public/             # Static assets
│   └── assets/         # Images and media
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── _components/ # React components
│   │   └── posts/      # Dynamic post pages
│   ├── config/         # Configuration files
│   ├── interfaces/     # TypeScript interfaces
│   └── lib/            # Utility functions
└── README.md
```

## Adding Content

### Blog Posts
Add new blog posts by creating Markdown files in the `_posts/` directory with front matter:

```markdown
---
title: "Your Post Title"
date: "2024-01-01"
excerpt: "Post excerpt"
coverImage: "/assets/blog/your-post/cover.jpg"
author: "Author Name"
---
```

### Articles
Add structured articles by creating JSON files in the `_articles/` directory.

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Customization

- Update `src/config/brand.json` for site branding
- Modify `src/config/hero.json` for hero section content
- Customize components in `src/app/_components/`
- Update styles in `src/app/globals.css`

## License

MIT License - feel free to use this project for your own blog!