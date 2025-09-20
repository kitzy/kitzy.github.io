/**
 * Projects Page GitHub Integration
 * Fetches specific featured repositories for the projects page
 */

async function loadFeaturedProjects() {
    const projectsContainer = document.getElementById('featured-projects');
    
    if (!projectsContainer) {
        return; // Only run on projects page
    }
    
    const featuredRepos = [
        'kitzy/fleet-gitops',
        'kitzy/docker-fleetdm-stack', 
        'kitzy/fleet-autopkg-recipes',
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
        
        // Generate HTML for each project
        const projectsHTML = repos.map(repo => {
            const languageHTML = repo.language ? 
                `<span class="project-language">${repo.language}</span>` : '';
            
            const starsHTML = repo.stargazers_count > 0 ? 
                `<span class="project-stars">⭐ ${repo.stargazers_count}</span>` : '';
            
            const forksHTML = repo.forks_count > 0 ? 
                `<span class="project-forks">🍴 ${repo.forks_count}</span>` : '';
            
            const topicsHTML = repo.topics && repo.topics.length > 0 ? 
                `<div class="project-topics">
                    ${repo.topics.map(topic => `<span class="project-topic">${topic}</span>`).join('')}
                </div>` : '';
            
            return `
                <div class="project-card">
                    <div class="project-header">
                        <h3><a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a></h3>
                        <div class="project-meta">
                            ${languageHTML}
                            ${starsHTML}
                            ${forksHTML}
                        </div>
                    </div>
                    
                    ${repo.description ? `<p class="project-description">${repo.description}</p>` : ''}
                    
                    ${topicsHTML}
                    
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link">View Repository</a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" rel="noopener" class="project-link">Live Demo</a>` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        // Update the container with projects
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