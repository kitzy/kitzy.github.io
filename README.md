# kitzy.github.io

Personal Jekyll site hosted on GitHub Pages showcasing professional profile, blog posts, and projects with dynamic GitHub integration.

🌐 **Live Site**: [kitzy.com](https://kitzy.com)  

## Open Source + Personal Content

This repository contains:
- ✅ **Open-source code**: Jekyll configuration, plugins, layouts, and JavaScript
- ❌ **Private content**: Blog posts, pages, and personal information (in `content/` directory)

The `content/` directory is excluded from the public repository via `.gitignore`. If you fork this project, you'll need to create your own `content/` directory with your content files.  

## Architecture Overview

This is a Jekyll 4.x site with custom Ruby plugins and GitHub Pages hosting via Actions. The site features a hybrid data loading approach:

- **Build-time**: Private repo access via `_plugins/github_languages.rb` 
- **Runtime**: Public API calls via `assets/js/github-integration.js`
- **Custom Domain**: kitzy.com (not github.io)
- **Branch Protection**: Main branch requires pull requests

## Quick Start

### Prerequisites
- Ruby 3.2+ 
- Bundler
- Git

### Development Setup

```bash
git clone https://github.com/kitzy/kitzy.github.io.git
cd kitzy.github.io
bundle install
bundle exec jekyll serve --port 4000
```

Visit: [http://localhost:4000](http://localhost:4000)

### Required Environment Variables

For full functionality, set in your build environment:

```bash
export PERSONAL_GITHUB_TOKEN="your_github_token"
```

This enables private repository access for language statistics during build.

## Development Workflow

**⚠️ Important**: Main branch is protected. All changes must go through pull requests.

```bash
# Create feature branch
git checkout -b feature-branch-name

# Make changes and commit
git add .
git commit -m "Description of changes"
git push origin feature-branch-name

# Create pull request
gh pr create --title "Title" --body "Description"

# Merge via GitHub UI or CLI
gh pr merge --merge
```

## Project Structure

```
kitzy.github.io/
├── _config.yml              # Jekyll configuration
├── _data/                   # Data files
├── _includes/               # Reusable components
│   ├── head.html
│   ├── navigation.html
│   └── sidebar.html
├── _layouts/                # Page templates
│   ├── default.html         # Main layout
│   ├── post.html           # Blog post layout
│   └── redirect.html       # Redirect template
├── _plugins/               # Custom Jekyll plugins
│   └── github_languages.rb # Language stats generator
├── assets/js/              # JavaScript modules
│   ├── main.js            # Core functionality
│   ├── github-integration.js
│   └── projects.js
├── content/                 # All site content (not open-sourced)
│   ├── _posts/             # Blog posts (YYYY-MM-DD-title.md)
│   ├── assets/             # Static content assets (favicon, etc.)
│   ├── pages/              # Static pages
│   │   ├── blog.md
│   │   ├── projects.md
│   │   ├── readme.md       # Personal user manual
│   │   └── index.md        # About/home page
│   └── redirects/          # Redirect pages
│       ├── broadcast.md
│       ├── live.md
│       └── studio.md
├── styles.css              # Main stylesheet
└── README.md              # This file
```

## Key Features

### Dual GitHub Integration System

1. **Build-time Language Stats** (`_plugins/github_languages.rb`)
   - Calculates weighted language statistics from all repositories
   - Requires `PERSONAL_GITHUB_TOKEN` for private repo access
   - Weight formula: `(stars + forks + 1)` per language per repo
   - Outputs top 8 languages to `site.data['github_languages']`

2. **Runtime Public Data** (`assets/js/github-integration.js`)
   - Fetches organizations, bio, and public repository data
   - Provides fallbacks when build-time data unavailable
   - Handles API rate limiting gracefully

## Content Management

### Content Directory Structure

All site content is organized in the `content/` directory (not included in public repository):

- `content/_posts/` - Blog posts with `YYYY-MM-DD-title.md` naming (underscore required)
- `content/pages/` - Static pages (about, blog index, projects, readme)
- `content/redirects/` - Simple redirect pages
- `content/assets/` - Static content assets (favicon, images, etc.)

### Creating Content

#### Blog Posts
Create posts in `content/_posts/` with frontmatter:

```yaml
---
layout: post
title: "Your Post Title"
description: "SEO description"
date: YYYY-MM-DD
tags: [optional, tags]
---

Your content here...
```

Posts are accessible at `/blog/post-title/`

#### Pages
Create pages in `content/pages/` with:

```yaml
---
layout: default
title: "Page Title"  
description: "Page description"
permalink: /custom-url/  # Optional
---
```

### JavaScript Architecture

- **Vanilla JS**: No framework dependencies
- **Async/Await**: Modern JavaScript patterns
- **Graceful Degradation**: Site functions without JavaScript
- **Module Pattern**: Separate concerns across files

## Deployment

### Automatic Deployment

Deployment triggers on:
- Push to `main` branch
- Pull request creation
- Manual workflow dispatch  
- Weekly cron (Sundays) for data refresh

### GitHub Actions Workflow

The `.github/workflows/deploy.yml` workflow:

1. **Build**: Ruby 3.2 + Jekyll + custom plugins
2. **Authentication**: Uses `PERSONAL_GITHUB_TOKEN` secret
3. **Deploy**: Automatic to GitHub Pages after successful build
4. **Permissions**: Pages write access via GITHUB_TOKEN

### Manual Deploy

```bash
# Build locally
bundle exec jekyll build

# The _site/ directory contains the built site
```

## Configuration

### Key Settings (`_config.yml`)

```yaml
url: "https://kitzy.com"          # Custom domain
repository: kitzy/kitzy.github.io
plugins:
  - jekyll-github-metadata
  - jekyll-sitemap
  - jekyll-feed
permalink: /:categories/:title/
collections:
  posts:
    output: true
    permalink: /blog/:title/
```

### Navigation

Configure site navigation in `_config.yml`:

```yaml
navigation:
  - title: "README"
    url: "/readme/"
  - title: "Projects" 
    url: "/projects/"
  - title: "Blog"
    url: "/blog/"
```

## Customization

### Adding New Features

1. **JavaScript**: Add modules to `assets/js/`
2. **Styles**: Modify single `styles.css` file
3. **Components**: Create includes in `_includes/`
4. **Plugins**: Add Ruby plugins to `_plugins/`

### Language Statistics

Modify `_plugins/github_languages.rb` to change:
- Weighting algorithm
- Number of languages displayed
- Excluded repositories
- Fallback behavior

### Sidebar Content

Edit `_includes/sidebar.html` to modify:
- Dynamic language display
- Social media links  
- Bio information
- Organization badges

## Troubleshooting

### Common Issues

**Build Failures**
- Check `PERSONAL_GITHUB_TOKEN` secret exists
- Validate YAML frontmatter in posts/pages
- Review Actions workflow logs

**JavaScript Issues**
- Monitor browser console for API errors
- Check `window.githubLanguagesData` exists
- Verify fallback content displays

### Local Development

**Ruby Dependencies**
```bash
bundle install
bundle update
```

**Jekyll Issues**
```bash
bundle exec jekyll clean
bundle exec jekyll build --verbose
```

**Port Conflicts**
```bash
bundle exec jekyll serve --port 4001
```

## Security

### Dependency Management

- `bundle-audit` for vulnerability scanning
- Regular dependency updates via Dependabot
- Security audit workflow in `.github/workflows/`

### Token Permissions

The `PERSONAL_GITHUB_TOKEN` should have minimal required scopes:
- `repo` (for private repository access)
- `read:org` (for organization data)

## Performance

- **Static Generation**: Fast loading via pre-built HTML
- **CDN**: GitHub Pages global content delivery
- **API Optimization**: Build-time data reduces runtime calls
- **Graceful Degradation**: Core functionality works without JavaScript

## Contributing

This is a personal site, but if you notice issues:

1. Fork the repository
2. Create a feature branch
3. Make your changes  
4. Submit a pull request

## License

This project is open source. Feel free to use as inspiration for your own Jekyll site.
