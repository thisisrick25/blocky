# Engineering Blog

This directory contains the engineering blog for the Blocky Editor project. It's a place to document architectural decisions, technical challenges, and the overall journey of building the project.

## Structure

- `/posts`: Contains all the blog posts, typically named with a date or sequence number (e.g., `2026-05-27-initial-architecture.md`).
- `/templates`: Contains markdown templates for new posts.
- `/assets`: Contains images and diagrams used in the blog posts.

## How to write a new post

1. Copy the template from `templates/post-template.md` to the `posts/` directory.
2. Rename it to a descriptive name, preferably prefixed with the date (e.g., `YYYY-MM-DD-topic.md`).
3. Fill out the frontmatter and the content!

## Serving the blog

Currently, this blog is maintained purely as Markdown files in the repository. If you want to publish it online later, you can easily:
- Point a static site generator (like Docusaurus, Astro, or Hugo) to this directory.
- Integrate MDX into the existing Next.js app (`src/app/blog`) to serve these files directly.
