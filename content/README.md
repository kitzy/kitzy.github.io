# Content Directory

This directory contains all the personal content for the site. It is intentionally separated from the codebase to make the distinction between open-source code and personal content clear.

## Structure

- **`_posts/`** - Blog posts in `YYYY-MM-DD-title.md` format (underscore required by Jekyll)
- **`pages/`** - Static pages (about, blog index, projects, etc.)
- **`redirects/`** - Simple redirect pages
- **`assets/`** - Static assets like favicon, images, etc.

## Why This Exists

This site's **code** is open source, but the **content** (blog posts, personal information, etc.) is not. By keeping all content in this single directory, it's easy to:

1. Exclude it from public repositories
2. Back it up separately
3. Make the boundary between code and content explicit

## Not Open-Sourced

This directory is listed in `.gitignore` and should not be committed to the public repository. If you fork this project, you'll need to create your own `content/` directory with your own content files.
