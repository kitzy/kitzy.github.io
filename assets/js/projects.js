/**
 * Projects Page GitHub Integration
 * Fetches specific featured repositories for the projects page
 */

async function loadFeaturedProjects() {
    const projectsContainer = document.getElementById('projects-container');
    
    if (!projectsContainer) {
        return; // Only run on projects page
    }
    
    const featuredRepos = [
        'kitzy/fleet-gitops',
        'kitzy/docker-fleetdm-stack', 
        'kitzy/fleet-autopkg-recipes',
        'autopkg/kitzy-recipes',
        'kitzy/dns',
        'fleetdm/fleet'
    ];
    
    try {
        console.log('Loading featured projects');
        
        // Fetch data for each featured repository
        const repoPromises = featuredRepos.map(async (repoPath) => {
            const response = await fetch(`https://api.github.com/repos/${repoPath}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${repoPath}: ${response.status}`);
            }
            return await response.json();
        });
        
        const repos = await Promise.all(repoPromises);
        console.log('Loaded featured projects:', repos);
        
        // Generate HTML for each project (GitHub pinned repos style)
        const projectsHTML = repos.map(repo => {
            const languageHTML = repo.language ? 
                `<span class="repo-language">
                    <span class="language-color" data-language="${repo.language.toLowerCase()}"></span>
                    ${repo.language}
                </span>` : '';
            
            const starsHTML = repo.stargazers_count > 0 ? 
                `<span class="repo-stat">
                    <svg class="repo-icon" viewBox="0 0 16 16" width="16" height="16">
                        <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                    </svg>
                    ${repo.stargazers_count}
                </span>` : '';
            
            const forksHTML = repo.forks_count > 0 ? 
                `<span class="repo-stat">
                    <svg class="repo-icon" viewBox="0 0 16 16" width="16" height="16">
                        <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                    </svg>
                    ${repo.forks_count}
                </span>` : '';
            
            return `
                <div class="pinned-repo">
                    <div class="pinned-repo-header">
                        <svg class="repo-icon" viewBox="0 0 16 16" width="16" height="16">
                            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"></path>
                        </svg>
                        <a href="${repo.html_url}" target="_blank" rel="noopener" class="repo-name">${repo.name}</a>
                        <span class="repo-visibility">Public</span>
                    </div>
                    
                    ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ''}
                    
                    <div class="repo-footer">
                        ${languageHTML}
                        ${starsHTML}
                        ${forksHTML}
                    </div>
                </div>
            `;
        }).join('');
        
        // Update the container with the projects
        projectsContainer.innerHTML = projectsHTML;
        
        console.log('Featured projects loaded successfully');
        
    } catch (error) {
        console.error('Error loading featured projects:', error);
        
        // Fallback content
        projectsContainer.innerHTML = `
            <div class="projects-error">
                <p>Unable to load projects at the moment. Please visit my <a href="https://github.com/kitzy" target="_blank">GitHub profile</a> to see my work.</p>
            </div>
        `;
    }
}

// Load projects when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFeaturedProjects);
} else {
    loadFeaturedProjects();
}