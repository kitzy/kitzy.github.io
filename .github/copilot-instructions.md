# Copilot Instructions

This is a personal Jekyll site hosted on GitHub Pages with custom GitHub Actions deployment. The site showcases professional profile, ### File Management

### Important Patterns
- **Generated**: `_site/` directory is Jekyll output, git-ignored
- **Cache**: `.jekyll-cache/` for build performance
- **Assets**: JavaScript files in `assets/js/`, single CSS file
- **Content**: All content files in `content/` directory (_posts, pages, redirects, assets)
- **Code vs Content**: `content/` directory separates personal content from open-source codests, and projects with dynamic GitHub integration.

## Architecture Overview

**Core Stack**: Jekyll 4.x with custom Ruby plugins, GitHub Pages hosting via Actions, dual-layer GitHub integration (build-time + runtime API calls)

**Key Pattern**: Hybrid data loading - build-time authentication for private repos via `_plugins/github_languages.rb`, runtime API calls for public data and fallbacks via `assets/js/github-integration.js`

**Branch Protection**: Main branch is protected - ALL changes must go through pull requests. Never push directly to main.

## Critical Workflows

### Development Workflow (Required)
```bash
git checkout -b feature-branch-name
# make changes
git add . && git commit -m "description"
git push origin feature-branch-name
gh pr create --title "Title" --body "Description"
# merge via GitHub UI or: gh pr merge --merge
```

### Local Development
```bash
bundle install
bundle exec jekyll serve --port 4000
# Site: http://localhost:4000
```

### Deployment Process
- **Trigger**: Push to main branch, PR creation, manual dispatch, weekly cron
- **Build**: Custom GitHub Actions workflow with Ruby 3.1 + Jekyll + plugins
- **Token**: Uses `PERSONAL_GITHUB_TOKEN` secret for private repo access during build
- **Deploy**: Automatic to GitHub Pages after successful build

## Project-Specific Patterns

### Dual GitHub Integration System
1. **Build-time**: `_plugins/github_languages.rb` calculates language stats from ALL repos (public + private) using token
2. **Runtime**: `assets/js/github-integration.js` fetches public API data for organizations, bio, fallbacks
3. **Data Flow**: Build-time data injected via `window.githubLanguagesData` in `_layouts/default.html`

### Custom Language Calculation
- **Weight Formula**: `(stars + forks + 1)` per repo with that language
- **Processing**: All repos (including forks) counted, top 8 languages returned
- **Fallback**: Static language array when token unavailable

### Content Organization
- **Posts**: `content/_posts/YYYY-MM-DD-title.md` format with post layout (underscore required)
- **Pages**: `content/pages/*.md` with default layout, custom permalinks
- **Redirects**: `content/redirects/*.md` with redirect layout
- **Assets**: `content/assets/` for static content files (favicon, images)
- **Navigation**: Configured in `_config.yml` navigation array
- **Dynamic Content**: README.md serves as personal user manual

### JavaScript Architecture
- **Core**: `assets/js/main.js` - mobile menu, heading anchors, code block enhancements
- **GitHub**: `assets/js/github-integration.js` - API calls, fallback handling, dynamic content
- **External**: `assets/js/external-content.js`, `projects.js` - content loading
- **Pattern**: Vanilla JS, async/await, graceful degradation

## Configuration Files

### `_config.yml` Key Settings
```yaml
url: "https://kitzy.com"  # Custom domain, not github.io
repository: kitzy/kitzy.github.io
plugins: [jekyll-github-metadata, jekyll-sitemap, jekyll-feed]
permalink: /:categories/:title/
blog_path: blog
collections:
  posts:
    output: true
    permalink: /blog/:title/
```

### Required Environment Variables
- `PERSONAL_GITHUB_TOKEN`: GitHub token for private repo access during build
- Must be set in GitHub repository secrets for Actions workflow

## Content Guidelines

### Blog Post Structure
```yaml
---
layout: post
title: "Title Here"
description: "SEO description for social previews"
date: YYYY-MM-DD
tags: [tag1, tag2]  # Optional
---
```

### Page Structure
```yaml
---
layout: default
title: "Page Title"
description: "Page description"
permalink: /custom-url/  # Optional
---
```

### Content Guidelines
- **Code License**: MIT License (open source)
- **Content License**: All rights reserved (publicly viewable but not open source)
- **Communication Style**: Direct, clear, authentic
- **Values**: Empathy, curiosity, authenticity, growth, playfulness

## Component Patterns

### Sidebar Dynamic Content (`_includes/sidebar.html`)
- **Languages**: Populated by JavaScript from build-time or API data
- **Organizations**: Always fetched from public GitHub API
- **Bio**: API-fetched, removes @fleetdm mentions
- **Social Links**: Hardcoded GitHub, LinkedIn, Bluesky, Slack
- **Email**: Removed from display (not shown in sidebar)

### Navigation System (`_layouts/default.html`)
- **Active State**: Compares `page.url` with navigation URLs
- **Special Case**: 'About' tab active for both '/' and explicit match
- **Mobile**: Toggle functionality via `assets/js/main.js`

### Code Enhancement
- **Copy Buttons**: Added to all `<pre><code>` blocks via JavaScript
- **Anchor Links**: Auto-generated for all headings in `.markdown-content`
- **Clipboard API**: Modern async clipboard with fallback for older browsers

## Build System Details

### Custom Plugin: `_plugins/github_languages.rb`
- **Purpose**: Generate language statistics from authenticated GitHub API
- **Token Check**: Falls back to static data if `PERSONAL_GITHUB_TOKEN` unavailable
- **Rate Limiting**: 0.1s sleep between API calls
- **Output**: `site.data['github_languages']` with languages array + metadata

### Jekyll Processing
- **Markdown**: kramdown processor
- **Syntax**: rouge highlighter
- **Permalinks**: Custom format `/:categories/:title/`
- **Collections**: Posts output to `/blog/:title/`

### Asset Pipeline
- **JavaScript**: Multiple files loaded in `_layouts/default.html`
- **Load Order**: marked.js → build-time data injection → main.js → specific modules
- **CSS**: Single `styles.css` file, responsive design

## Common Tasks

### Adding Blog Post
1. Create `content/_posts/YYYY-MM-DD-title.md` with required frontmatter
2. Test locally: `bundle exec jekyll serve`
3. Follow branch workflow: feature branch → PR → merge

### Updating GitHub Integration
1. **Build-time**: Modify `_plugins/github_languages.rb` for data processing
2. **Runtime**: Edit `assets/js/github-integration.js` for API calls/display
3. Test fallback behavior (no token scenario)

### Modifying Site Structure
1. **Navigation**: Update `_config.yml` navigation array
2. **Layout**: Edit `_layouts/default.html` or `_layouts/post.html`
3. **Styling**: Modify `styles.css` (single file approach)

## Troubleshooting

### Branch Protection Errors
- **Error**: "push declined due to repository rule violations"
- **Solution**: Always use feature branch + PR workflow, never push to main

### Build Failures
- **Token Issues**: Check `PERSONAL_GITHUB_TOKEN` secret exists and has repo access
- **Jekyll Errors**: Validate YAML frontmatter syntax in posts/pages
- **Plugin Errors**: Check Ruby syntax in `_plugins/` directory

### JavaScript Issues
- **API Rate Limits**: Monitor browser console for 403 responses
- **Build-time Data**: Check `window.githubLanguagesData` exists
- **Fallbacks**: Verify fallback content displays when API fails

### GitHub Actions Debug
- Check workflow logs for Ruby/Jekyll errors
- Verify artifact upload success
- Confirm Pages deployment completion

## File Management

### Important Patterns
- **Generated**: `_site/` directory is Jekyll output, git-ignored
- **Cache**: `.jekyll-cache/` for build performance
- **Assets**: JavaScript files in `assets/js/`, single CSS file
- **Content**: Markdown files in `_posts/`, `_pages/`, and root

### Branch Cleanup
- Remote branches auto-deleted after PR merge
- Always delete local feature branches: `git branch -d branch-name`
- Use descriptive names: `add-blog-post-title`, `fix-sidebar-links`

## Performance Considerations

- **Static Generation**: Fast loading via Jekyll pre-build
- **API Caching**: Build-time language data reduces runtime API calls  
- **CDN**: GitHub Pages provides global content delivery
- **Graceful Degradation**: JavaScript failures don't break core functionality

## Development Philosophy

This site balances professional presentation with authentic personality. Code should be:
- **Maintainable**: Clear structure, comprehensive error handling
- **Accessible**: Semantic HTML, responsive design, proper ARIA labels
- **Performant**: Efficient API usage, static-first approach
- **Personal**: Reflects Kitzy's values and communication style

The codebase serves both as professional portfolio and platform for sharing technical insights and career experiences.