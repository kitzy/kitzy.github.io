/**
 * GitHub Integration for Dynamic Sidebar Content
 * Fetches real languages and organizations from GitHub API
 */

async function loadGitHubData() {
    const username = 'kitzy';
    
    try {
        console.log('Loading GitHub data for', username);
        
        // Check for GitHub token (for private repos access)
        const token = getGitHubToken();
        const headers = token ? { 'Authorization': `token ${token}` } : {};
        
        console.log('Using GitHub token:', token ? 'Yes (private repos included)' : 'No (public repos only)');
        
        // Fetch user data, repositories (including private if token provided), and organizations
        const [userResponse, reposResponse, orgsResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`, { headers }),
            fetch(`https://api.github.com/user/repos?per_page=100&sort=updated&type=all&affiliation=owner`, { headers }),
            fetch(`https://api.github.com/users/${username}/orgs`, { headers })
        ]);

        if (!userResponse.ok || !reposResponse.ok || !orgsResponse.ok) {
            console.warn('Some GitHub API calls failed, falling back to public-only data');
            
            // Fallback to public-only endpoints if authenticated calls fail
            const [fallbackReposResponse] = await Promise.all([
                fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`)
            ]);
            
            if (!userResponse.ok || !fallbackReposResponse.ok) {
                throw new Error('Failed to fetch GitHub data');
            }
            
            const user = await userResponse.json();
            const repos = await fallbackReposResponse.json();
            const orgs = orgsResponse.ok ? await orgsResponse.json() : [];
            
            processGitHubData(user, repos, orgs, false);
        } else {
            const user = await userResponse.json();
            const repos = await reposResponse.json();
            const orgs = await orgsResponse.json();
            
            processGitHubData(user, repos, orgs, token ? true : false);
        }

    } catch (error) {
        console.error('Error loading GitHub data:', error);
        
        // Fallback content on error
        setFallbackContent();
    }
}

function getGitHubToken() {
    // Check for token in localStorage (set by user)
    return localStorage.getItem('github_token');
}

function processGitHubData(user, repos, orgs, includesPrivateRepos) {

        console.log(`Loaded ${repos.length} repositories and ${orgs.length} organizations`);
        console.log('User data:', user);
        console.log('Includes private repos:', includesPrivateRepos);

        // Update bio if available
        const bioContainer = document.getElementById('github-bio');
        if (bioContainer && user.bio) {
            bioContainer.textContent = user.bio;
            console.log('Updated bio:', user.bio);
        }

        // Debug: Log all repositories and their languages
        console.log('All repositories:');
        repos.forEach(repo => {
            console.log(`- ${repo.name}: ${repo.language || 'No language'} (fork: ${repo.fork}, stars: ${repo.stargazers_count}, private: ${repo.private})`);
        });

        // Calculate top languages from repositories
        const languages = {};
        let processedRepos = 0;
        
        repos.forEach(repo => {
            if (repo.language) { // Count all repos with languages (including forks and private repos)
                languages[repo.language] = (languages[repo.language] || 0) + repo.stargazers_count + 1;
                processedRepos++;
                console.log(`Added ${repo.language} from ${repo.name} (score: ${repo.stargazers_count + 1}, fork: ${repo.fork}, private: ${repo.private})`);
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
}

function setFallbackContent() {
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

// Load GitHub data when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGitHubData);
} else {
    // DOM is already loaded
    loadGitHubData();
}