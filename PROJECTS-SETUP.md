# GitHub Pages Website Setup

## Adding Featured Projects

To add or modify featured projects, simply edit the `featuredProjects` array in `script.js`:

```javascript
featuredProjects: [
    // Just add repository names here - everything else auto-populates!
    'fleet',
    'docker-fleetdm-stack',
    'fleet-gitops',
    'fleet-autopkg-recipes',
    'dns',
    'autopkg-runner'
]
```

### How it works:
1. **Repository Names Only**: Just add the repository name (not the full URL)
2. **Auto-Population**: The system automatically fetches:
   - Repository description
   - Star count
   - Fork count
   - Primary programming language
   - Public/Private status
   - Repository URL
3. **Live Data**: All information is fetched live from GitHub's API

### Adding a new project:
1. Open `script.js`
2. Add the repository name to the `featuredProjects` array
3. Save the file
4. The project will appear automatically on the Projects tab

### Example:
```javascript
featuredProjects: [
    'fleet',
    'my-awesome-project',  // ← Add new project here
    'another-repo'
]
```

That's it! No need to manually enter descriptions, stats, or URLs - everything is pulled automatically from GitHub.

## Language Colors

The system automatically displays programming language colors that match GitHub's standard colors for:
- JavaScript
- Python
- TypeScript
- Go
- Rust
- Java
- HTML
- CSS
- Shell
- Dockerfile
- YAML
- JSON
- Markdown
- HCL (Terraform)

New language colors can be added in the CSS file under the `.language-color` classes.