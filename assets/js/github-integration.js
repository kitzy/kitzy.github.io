/**
 * GitHub Integration for Dynamic Sidebar Content
 * Fetches real languages and organizations from GitHub API
 */

async function loadGitHubData() {
    const username = 'kitzy';
    
    try {
        console.log('Loading GitHub data for', username);
        
        // Fetch user data, repositories, and organizations
        const [userResponse, reposResponse, orgsResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`),
            fetch(`https://api.github.com/users/${username}/orgs`)
        ]);

        if (!userResponse.ok || !reposResponse.ok || !orgsResponse.ok) {
            throw new Error('Failed to fetch GitHub data');
        }

        const user = await userResponse.json();
        const repos = await reposResponse.json();
        const orgs = await orgsResponse.json();

        console.log(`Loaded ${repos.length} repositories and ${orgs.length} organizations`);

        // Debug: Log all repositories and their languages
        console.log('All repositories:');
        repos.forEach(repo => {
            console.log(`- ${repo.name}: ${repo.language || 'No language'} (fork: ${repo.fork}, stars: ${repo.stargazers_count})`);
        });

        // Calculate top languages from repositories
        const languages = {};
        let processedRepos = 0;
        
        repos.forEach(repo => {
            if (repo.language && !repo.fork) { // Only count non-forked repos
                languages[repo.language] = (languages[repo.language] || 0) + repo.stargazers_count + 1;
                processedRepos++;
                console.log(`Added ${repo.language} from ${repo.name} (score: ${repo.stargazers_count + 1})`);
            }
        });

        console.log(`Processed ${processedRepos} repositories with languages`);
        console.log('Language counts:', languages);

        // Get top 6 languages sorted by usage (stars + count)
        const languageEntries = Object.entries(languages);
        console.log('Language entries before sorting:', languageEntries);
        
        const sortedLanguages = languageEntries.sort(([,a], [,b]) => b - a);
        console.log('Sorted languages:', sortedLanguages);
        
        const topLanguages = sortedLanguages.slice(0, 6).map(([lang]) => lang);
        console.log('Top 6 languages:', topLanguages);

        // Update languages in sidebar
        const languagesContainer = document.getElementById('github-languages');
        if (languagesContainer) {
            if (topLanguages.length > 0) {
                languagesContainer.innerHTML = topLanguages.map(lang => 
                    `<span class="sidebar-language-tag">${lang}</span>`
                ).join('');
            } else {
                // Fallback if no languages found
                languagesContainer.innerHTML = `
                    <span class="sidebar-language-tag">JavaScript</span>
                    <span class="sidebar-language-tag">Python</span>
                    <span class="sidebar-language-tag">Shell</span>
                    <span class="sidebar-language-tag">YAML</span>
                    <span class="sidebar-language-tag">HTML</span>
                    <span class="sidebar-language-tag">CSS</span>
                `;
            }
        }

        // Update organizations
        const orgsContainer = document.getElementById('github-organizations');
        if (orgsContainer) {
            if (orgs.length > 0) {
                console.log('Organizations data:', orgs); // Debug log
                orgsContainer.innerHTML = orgs.map(org => 
                    `<a href="https://github.com/${org.login}" target="_blank" class="sidebar-org-link" title="${org.login}">
                        <img src="${org.avatar_url}&s=40" alt="${org.login}" class="sidebar-org-icon">
                    </a>`
                ).join('');
            } else {
                // Fallback to Fleet organization
                orgsContainer.innerHTML = `
                    <a href="https://github.com/fleetdm" target="_blank" class="sidebar-org-link" title="Fleet">
                        <img src="https://avatars.githubusercontent.com/u/65584068?s=40&v=4" alt="Fleet" class="sidebar-org-icon">
                    </a>
                `;
            }
        }

        console.log('GitHub data loaded successfully');

    } catch (error) {
        console.error('Error loading GitHub data:', error);
        
        // Fallback content on error
        const languagesContainer = document.getElementById('github-languages');
        if (languagesContainer) {
            languagesContainer.innerHTML = `
                <span class="sidebar-language-tag">JavaScript</span>
                <span class="sidebar-language-tag">Python</span>
                <span class="sidebar-language-tag">Shell</span>
                <span class="sidebar-language-tag">YAML</span>
                <span class="sidebar-language-tag">HTML</span>
                <span class="sidebar-language-tag">CSS</span>
            `;
        }

        const orgsContainer = document.getElementById('github-organizations');
        if (orgsContainer) {
            orgsContainer.innerHTML = `
                <a href="https://github.com/fleetdm" target="_blank" class="sidebar-org-link" title="Fleet">
                    <img src="https://avatars.githubusercontent.com/u/65584068?s=40&v=4" alt="Fleet" class="sidebar-org-icon">
                </a>
            `;
        }
    }
}

// Load GitHub data when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGitHubData);
} else {
    // DOM is already loaded
    loadGitHubData();
}