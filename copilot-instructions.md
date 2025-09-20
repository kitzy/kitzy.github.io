# Copilot Instructions for kitzy.github.io

This is a Jekyll-powered personal website hosted on GitHub Pages. The site showcases Kitzy's professional profile, blog posts, and projects with dynamic GitHub integration.

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
├── README.md               # Personal user manual (source)
├── Gemfile                 # Ruby dependencies
└── copilot-instructions.md # This file
```

## Branch Protection & Git Workflow

### ⚠️ IMPORTANT: Main Branch Protection Rules

This repository has **branch protection rules** enabled on the `main` branch:
- **Direct pushes to main are BLOCKED**
- **All changes must go through pull requests**
- **Always create feature branches for any changes**

### Required Git Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feature-branch-name
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "Descriptive commit message"
   ```

3. **Push feature branch**:
   ```bash
   git push origin feature-branch-name
   ```

4. **Create pull request**:
   ```bash
   gh pr create --title "PR Title" --body "Description"
   ```

5. **Merge pull request**:
   ```bash
   gh pr merge PR_NUMBER --merge
   ```

6. **Clean up after merge**:
   ```bash
   git checkout main
   git pull origin main
   git branch -d feature-branch-name  # Delete local branch
   ```

### Branch Cleanup Notes
- **Remote branches are auto-deleted**: GitHub automatically deletes head branches after PR merge
- **Always delete local branches**: Prevent clutter and confusion
- **Use descriptive branch names**: e.g., `fix-sidebar-links`, `add-blog-post`, `update-readme-content`

## Core Features

### 1. Dynamic Sidebar with GitHub Integration
- **Real-time GitHub data**: Languages, organizations, profile info
- **API Integration**: JavaScript fetches from GitHub API (`assets/js/github-integration.js`)
- **Graceful fallbacks**: Static content if API unavailable
- **CSS Classes**: `.sidebar-language-tag`, `.sidebar-org-icon`, `.sidebar-org-link`

### 2. Social Media Previews
- **Open Graph tags**: For LinkedIn, Facebook sharing
- **Twitter Cards**: For Twitter/X sharing
- **Bluesky compatibility**: Uses Open Graph standards
- **Dynamic meta tags**: Per-page customization in `_includes/head.html`

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
  - title: "README"
    url: "/readme/"
  - title: "Resume"
    url: "/resume/"
  - title: "Projects"
    url: "/projects/"
  - title: "Blog"
    url: "/blog/"
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
  permalink: /page-url/
  ---
  ```

## Styling Guidelines

### CSS Architecture
- **Responsive design**: Mobile-first approach
- **CSS Grid/Flexbox**: Modern layout techniques
- **Component-based**: Modular CSS for sidebar, navigation, etc.
- **Dark theme**: Modern dark color scheme

### Key CSS Classes
- `.sidebar` - Main sidebar container
- `.sidebar-language-tag` - Programming language badges
- `.sidebar-org-icon` - Organization avatars
- `.sidebar-org-link` - Organization links
- `.tab-navigation` - Main navigation tabs
- `.main-content` - Primary content area
- `.markdown-content` - Styled content wrapper

## JavaScript Patterns

### GitHub Integration
- **File**: `assets/js/github-integration.js`
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

### Deployment Process
1. **GitHub Pages**: Automatic deployment on push to main
2. **Jekyll build**: GitHub handles build automatically
3. **Branch protection**: All changes via pull requests
4. **Build time**: ~2-3 minutes after merge

### Testing Changes
1. Test locally with `bundle exec jekyll serve`
2. Check responsive design
3. Verify JavaScript functionality
4. Test social media previews
5. Validate HTML/CSS

## SEO & Performance

### Meta Tags
- **Dynamic titles**: Per-page customization
- **Descriptions**: Unique for each page/post
- **Open Graph**: Social media previews
- **Canonical URLs**: Prevent duplicate content

### Performance
- **Static generation**: Fast loading times
- **Minified assets**: Optimize CSS/JS (if implemented)
- **Image optimization**: Proper sizing and formats
- **CDN**: GitHub Pages provides global CDN

## Common Tasks

### Adding a New Blog Post
1. Create `_posts/YYYY-MM-DD-title.md`
2. Add required frontmatter
3. Write content in Markdown
4. Create feature branch: `git checkout -b add-blog-post-title`
5. Test locally: `bundle exec jekyll serve`
6. Push and create PR
7. Merge and clean up branch

### Updating Content Pages
1. Edit files in `_pages/` directory
2. Maintain frontmatter structure
3. Use proper HTML in markdown content
4. Follow branch workflow for changes

### Modifying Sidebar/Navigation
1. Edit `_includes/sidebar.html` for sidebar changes
2. Edit `_config.yml` navigation section for nav changes
3. Update CSS classes as needed
4. Test JavaScript functionality

### Updating GitHub Integration
1. Modify `assets/js/github-integration.js`
2. Update API calls or data processing
3. Test with browser dev tools
4. Check fallback behavior
5. Monitor console for errors

## Troubleshooting

### Common Issues
- **Jekyll build failures**: Check `_config.yml` syntax and frontmatter
- **GitHub API rate limits**: Monitor console for 403 errors
- **Branch protection errors**: Always use pull request workflow
- **Missing dependencies**: Run `bundle install`
- **Social previews not working**: Check Open Graph tags in `_includes/head.html`

### Debug Steps
1. Check Jekyll build logs in GitHub Actions
2. Validate YAML frontmatter syntax
3. Test JavaScript in browser console
4. Verify GitHub API responses
5. Check responsive design across devices
6. Test social media preview tools

### Error Messages
- **"push declined due to repository rule violations"**: Use pull request workflow
- **"Address already in use"**: Jekyll server already running, use different port
- **"Liquid syntax error"**: Check for unescaped liquid tags in content

## File Management

### Important Files to Never Edit Directly
- `_site/` - Generated by Jekyll, ignored by git
- `.jekyll-cache/` - Jekyll cache directory

### Key Files for Common Changes
- **Content**: `_pages/*.md`, `_posts/*.md`, `index.md`
- **Layout**: `_layouts/*.html`
- **Styling**: `assets/css/`
- **Functionality**: `assets/js/`
- **Configuration**: `_config.yml`

## Contact & Context

**Owner**: Kitzy (they/them or she/her)
**Role**: Customer Support Engineer at Fleet
**Focus**: Infrastructure, automation, endpoint management
**Experience**: 15+ years in IT engineering and endpoint management

### Personal Working Style (from README.md)
- **AuDHD (autism + ADHD)**: Multiple trains of thought, time blindness
- **Communication**: Direct and clear preferred
- **Work style**: Collaborative, variety-loving, needs clear priorities
- **Values**: Empathy, curiosity, authenticity, growth, playfulness

## Development Philosophy

This site serves as both a professional portfolio and a platform for sharing technical insights and career experiences. The codebase should remain:
- **Maintainable**: Clear structure and documentation
- **Accessible**: Proper semantic HTML and responsive design
- **Performant**: Fast loading and efficient code
- **Professional**: Reflecting Kitzy's technical expertise

## Quick Reference Commands

```bash
# Start development
bundle exec jekyll serve --port 4000

# Standard workflow
git checkout -b feature-name
git add .
git commit -m "Description"
git push origin feature-name
gh pr create --title "Title" --body "Description"
gh pr merge PR_NUMBER --merge

# Cleanup after merge
git checkout main
git pull origin main
git branch -d feature-name
```
