# Copilot Instructions for kitzy.github.io

This is a Jekyll-powered personal website hosted on GitHub Pages. The site showcases Kitzy's professional profile, blog posts, and projects with dynamic GitHub integration.

## ⚠️ IMPORTANT: Branch Protection Rules

**This repository has branch protection enabled on the main branch.**

- **Direct pushes to main are BLOCKED**
- **All changes MUST go through pull requests**
- **Use feature branches for all development**
- **GitHub CLI recommended**: `gh pr create` and `gh pr merge`

Always follow the pull request workflow - direct pushes will be rejected by GitHub.

## Project Overview

**Purpose**: Personal portfolio and blog site for Kitzy (Customer Support Engineer at Fleet)
**Technology Stack**: Jekyll static site generator, GitHub Pages hosting, JavaScript for dynamic content
**Architecture**: Static site with server-side rendering for reliable social media previews

## Key Technologies & Dependencies

- **Jekyll 4.x** - Static site generator with Liquid templating
- **GitHub Pages** - Hosting with automatic Jekyll builds
- **Liquid Templates** - Jekyll's templating language for dynamic content
- **Sass/SCSS** - CSS preprocessing (if used)
- **JavaScript ES6+** - For dynamic GitHub API integration
- **Markdown** - Content format for posts and pages

### Required Gems (Gemfile)
- `jekyll` - Core static site generator
- `jekyll-github-metadata` - GitHub profile integration
- `jekyll-sitemap` - XML sitemap generation
- `jekyll-feed` - RSS feed generation

## Project Structure

```
kitzy.github.io/
├── _config.yml              # Jekyll configuration
├── _layouts/                 # Page templates
│   ├── default.html         # Main layout with navigation
│   └── post.html           # Blog post layout
├── _includes/               # Reusable components
│   ├── head.html           # HTML head with meta tags
│   └── sidebar.html        # Dynamic sidebar with GitHub data
├── _pages/                  # Static pages
│   ├── about.md            # About page content
│   ├── resume.md           # Resume/CV page
│   ├── readme.md           # Personal user manual
│   └── projects.md         # Projects showcase
├── _posts/                  # Blog posts
│   └── YYYY-MM-DD-title.md # Blog post format
├── assets/                  # Static assets
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   │   ├── main.js         # Core site functionality
│   │   └── github-integration.js # GitHub API integration
│   └── images/             # Image assets
├── index.md                # Homepage content
└── Gemfile                 # Ruby dependencies
```

## Core Features

### 1. Dynamic Sidebar with GitHub Integration
- **Real-time GitHub data**: Languages, organizations, profile info
- **API Integration**: JavaScript fetches from GitHub API
- **Graceful fallbacks**: Static content if API unavailable
- **CSS Classes**: `.sidebar-language-tag`, `.sidebar-org-icon`

### 2. Social Media Previews
- **Open Graph tags**: For LinkedIn, Facebook sharing
- **Twitter Cards**: For Twitter/X sharing
- **Bluesky compatibility**: Uses Open Graph standards
- **Dynamic meta tags**: Per-page customization

### 3. Blog System
- **Jekyll posts**: Standard `_posts/YYYY-MM-DD-title.md` format
- **Frontmatter**: YAML metadata for each post
- **Permalinks**: SEO-friendly URLs
- **RSS feed**: Auto-generated via jekyll-feed

### 4. Navigation System
- **Tab-based UI**: JavaScript-powered navigation
- **Active states**: Highlights current page
- **Mobile responsive**: Hamburger menu for small screens

## Configuration Files

### _config.yml Key Settings
```yaml
title: "Kitzy"
description: "Customer Support Engineer at Fleet | Infrastructure Nerd"
url: "https://kitzy.github.io"
github_username: kitzy
repository: "kitzy/kitzy.github.io"

plugins:
  - jekyll-github-metadata
  - jekyll-sitemap
  - jekyll-feed

navigation:
  - title: "About"
    url: "/"
  - title: "Resume"
    url: "/resume/"
  # ... more nav items
```

## Content Guidelines

### Blog Posts
- **Location**: `_posts/` directory
- **Naming**: `YYYY-MM-DD-title.md`
- **Frontmatter Required**:
  ```yaml
  ---
  layout: post
  title: "Post Title"
  description: "SEO description for social previews"
  date: YYYY-MM-DD
  ---
  ```

### Pages
- **Location**: `_pages/` directory or root
- **Frontmatter Required**:
  ```yaml
  ---
  layout: default
  title: "Page Title"
  description: "Page description"
  ---
  ```

## Styling Guidelines

### CSS Architecture
- **Responsive design**: Mobile-first approach
- **CSS Grid/Flexbox**: Modern layout techniques
- **Component-based**: Modular CSS for sidebar, navigation, etc.
- **Dark/light themes**: Consider user preferences

### Key CSS Classes
- `.sidebar` - Main sidebar container
- `.sidebar-language-tag` - Programming language badges
- `.sidebar-org-icon` - Organization avatars
- `.tab-navigation` - Main navigation tabs
- `.main-content` - Primary content area

## JavaScript Patterns

### GitHub Integration
- **Async/await**: Modern promise handling
- **Error handling**: Graceful degradation
- **API rate limiting**: Respect GitHub API limits
- **DOM manipulation**: Vanilla JS preferred

### Code Style
- **ES6+ features**: Use modern JavaScript
- **Modular functions**: Single responsibility principle
- **Event listeners**: Proper DOM ready handling
- **Console logging**: For debugging GitHub API calls

## Development Workflow

### Local Development
```bash
bundle install          # Install dependencies
bundle exec jekyll serve # Start development server
# Site available at http://localhost:4000
```

### Deployment
- **GitHub Pages**: Automatic deployment on push to main
- **Branch protection**: ⚠️ **CRITICAL** - Main branch is protected, requires pull requests
- **Build process**: GitHub handles Jekyll build automatically

### Git Workflow (REQUIRED - Main Branch Protected)
1. **NEVER push directly to main** - Branch protection rules prevent this
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and commit
4. Push branch: `git push origin feature-name`
5. Create pull request: `gh pr create`
6. Merge PR: `gh pr merge PR_NUMBER --merge`
7. Switch back and pull: `git checkout main && git pull origin main`

**Important**: All changes MUST go through pull request workflow due to repository protection rules.

## SEO & Performance

### Meta Tags
- **Dynamic titles**: Per-page customization
- **Descriptions**: Unique for each page/post
- **Open Graph**: Social media previews
- **Canonical URLs**: Prevent duplicate content

### Performance
- **Static generation**: Fast loading times
- **Minified assets**: Optimize CSS/JS
- **Image optimization**: Proper sizing and formats
- **CDN**: GitHub Pages provides global CDN

## Common Tasks

### Adding a New Blog Post
1. Create `_posts/YYYY-MM-DD-title.md`
2. Add required frontmatter
3. Write content in Markdown
4. Test locally
5. Deploy via git push

### Updating GitHub Integration
- Modify `assets/js/github-integration.js`
- Update API calls or data processing
- Test with browser dev tools
- Check fallback behavior

### Styling Changes
- Update CSS in `assets/css/`
- Use existing class patterns
- Test responsive behavior
- Maintain accessibility

## Troubleshooting

### Common Issues
- **Jekyll build failures**: Check `_config.yml` syntax
- **GitHub API rate limits**: Implement caching or auth
- **Branch protection**: Use pull request workflow
- **Missing dependencies**: Run `bundle install`

### Debug Steps
1. Check Jekyll build logs
2. Validate YAML frontmatter
3. Test JavaScript in browser console
4. Verify GitHub API responses
5. Check responsive design

## Contact & Context

**Owner**: Kitzy (they/them or she/her)
**Role**: Customer Support Engineer at Fleet
**Focus**: Infrastructure, automation, endpoint management
**Experience**: 15+ years in IT engineering and endpoint management

This site serves as both a professional portfolio and a platform for sharing technical insights and career experiences.