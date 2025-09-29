# kitzy.github.io

Personal Jekyll site hosted on GitHub Pages showcasing professional profile, blog posts, and projects with dynamic GitHub integration.

🌐 **Live Site**: [kitzy.com](https://kitzy.com)  
📖 **Personal README**: [/readme/](https://kitzy.com/readme/)

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
├── _pages/                  # Static pages
│   ├── blog.md
│   ├── projects.md
│   └── readme.md           # Personal user manual
├── _plugins/               # Custom Jekyll plugins
│   └── github_languages.rb # Language stats generator
├── _posts/                 # Blog posts (YYYY-MM-DD-title.md)
├── assets/js/              # JavaScript modules
│   ├── main.js            # Core functionality
│   ├── github-integration.js
│   └── projects.js
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

### Content Management

#### Blog Posts
Create posts in `_posts/` with frontmatter:

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
Create pages in `_pages/` or root with:

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

**Branch Protection Errors**
```
push declined due to repository rule violations
```
Solution: Use feature branch + pull request workflow

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

---

**Personal Context**: This site reflects Kitzy's professional work as a Customer Support Engineer at Fleet, along with personal insights about being AuDHD (autism + ADHD) in tech. The [personal README](https://kitzy.com/readme/) contains the "user manual" for working with Kitzy.  

---

## Things to know about me
- I sometimes overcommit because my enthusiasm writes checks my calendar can’t cash. A reminder to pace myself is always welcome.  
- I can get so busy helping others that I forget to drink water or breathe. Gentle nudges to take care of myself are appreciated.  
- My brain alternates between hyperfocus (deep in the matrix) and scatter (every shiny thing is suddenly fascinating). Both are normal settings for me.  
- Authenticity matters to me. If something’s off, just tell me. I’ll take honesty over guesswork any day.
- I’m generally non-confrontational, I don’t like telling people things they don’t want to hear.
- Most of the time, I consider myself a reasonable person.
- I want people to get along, I want to like people, and I want people to like me.
- I want to understand viewpoints that differ from mine.
- If my tombstone someday says *“she was nice to work with,”* I’ll have done alright.  


---

## My values
- **Empathy as a baseline:** I believe life is better when people look out for each other. Thoughtfulness and small acts of care go a long way with me.  
- **Curiosity first:** I’d rather ask questions and explore possibilities than pretend to know everything. For me, curiosity is the gateway to clarity.  
- **Authenticity over polish:** I’d rather things be real and imperfect than fake and shiny. I value honesty and transparency, even when the truth is messy.  
- **Growth and learning:** Mistakes happen; what matters is taking responsibility, adapting, and improving. I’ll own my work and my missteps, and I appreciate when others do too.  
- **Playfulness:** Humor and lightness make hard work more sustainable. I believe we can take our work seriously without taking *ourselves* too seriously.  

---

## How I work best
- I get inspired at odd hours. If you see me filing issues and creating pull requests at midnight, that’s just the hamster in my brain choosing to sprint on the wheel. Please don’t ever feel pressure to respond outside your normal working hours.  
- Collaboration fuels me. I’m happiest when I can bounce ideas around like mental ping-pong.  
- Variety keeps me energized. Give me a buffet of tasks, and I’ll happily graze.  
- Clear priorities help me focus. Otherwise I may try to juggle flaming torches *and* chainsaws simultaneously.  

---

## What I value in coworkers
- Authenticity and honesty (yes, even blunt honesty).  
- Thoughtfulness. Small kindnesses land big with me.  
- Curiosity and playfulness. Problem-solving doesn’t have to be boring.  
- Respect for different rhythms and quirks. Neurodivergence is part of the team, not a bug.  

---

## How to communicate with me
- **Be clear and kind.** I love warmth, but I also need straightforwardness.  
- **Explicit is better than implicit.** Subtle hints often sneak right past me.  
- **Quick check-ins help.** A simple “just confirming you’re good with this?” is magic.  
- **Ping me if I’m late.** Think of it as tapping me on the shoulder in the time-fog.  

---

## How to support me
- **Watch for signals.** If I get snappy, bossy, or perfectionistic, I’m probably feeling unappreciated or overloaded. A little acknowledgment helps more than you’d think.  
- **Remind me of boundaries.** Sometimes I try to be everyone’s emotional support human. Remind me it’s okay to step back.  
- **Anchor me in priorities.** When stress hits, my inner Type 7 scatters like confetti. Help me pick up the right piece first.  
- **Allow my moods.** My Type 4 side sometimes goes “moody indie soundtrack.” I don’t need fixing; I just need space.  
- **Humor works.** A well-timed joke resets me better than a motivational poster ever could.  

---

## How I like to receive feedback

- **Direct is best.** I don’t do well with vague hints. If something’s off, say it plainly. I can't fix what I don't know is broken.  
- **Kindness matters.** I’m open to constructive criticism, but I’ll absorb it more easily if it’s framed with care.  
- **Timely > perfect.** Don’t wait weeks to craft the perfect message, tell me soon while it’s fresh and actionable.  
- **Private first, public later.** Critical feedback lands best in private. Positive feedback can be anywhere (and I’ll probably beam like a proud raccoon).  
- **Pair it with clarity.** If you can, include specific examples or suggestions. Otherwise my brain may spiral trying to fill in the blanks.  

---

## My beliefs
These are the principles that guide how I see the world and how I show up at work and in life:  

- Honest, practical education is better than pretending tough topics don’t exist.  
- When we care for our environment, it has a way of caring for us in return.  
- To quote Adam Savage: *I believe that inside every tool is a hammer.*  
- Every person has the right to make their own choices about their own body.  
- Everyone has the right to show up in the world as the identity that feels true to them, whether that’s gender, name, pronouns, or any other expression of self.  
- Communities thrive when we step up for each other in times of need.  
- “Perfect” doesn’t exist, the real magic is in making small improvements, again and again.  
- Don’t do to others what you wouldn’t want done to you.  
- While not everyone is inherently good, most people are at least trying.  
- Morality comes from love and compassion, not from a checklist of rules.  


## Quick reference

**Energizes me:**  
- Brainstorming and bouncing ideas  
- Variety and new challenges  
- Humor and playfulness  
- Feeling useful and supportive  
- Clear goals (plus room to get creative in how to reach them)  

**Drains me:**  
- Ambiguity and unclear expectations (my brain fills in the blanks with chaos)  
- Endless repetitive tasks  
- Being taken for granted when I’ve overextended  
- Feeling like I have to “mask” my quirks
