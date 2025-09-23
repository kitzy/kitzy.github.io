/**
 * GitHub Integration for Dynamic Sidebar Content
 * Uses build-time generated language data when available, falls back to API
 */

async function loadGitHubData() {
    const username = 'kitzy';
    
    try {
        console.log('Loading GitHub data for', username);
        
        // Try to use build-time generated language data first
        if (window.githubLanguagesData && window.githubLanguagesData.languages) {
            console.log('Using build-time generated language data');
            updateLanguagesDisplay(window.githubLanguagesData.languages);
        } else {
            console.log('No build-time data available, fetching from API...');
            await loadLanguagesFromAPI(username);
        }
        
        // Always fetch organizations from API (these don't change often and don't need private access)
        await loadOrganizationsFromAPI(username);
        
        // Always try to update bio from API
        await loadBioFromAPI(username);
        
        console.log('GitHub data loaded successfully');

    } catch (error) {
        console.error('Error loading GitHub data:', error);
        setFallbackContent();
    }
}

async function loadLanguagesFromAPI(username) {
    // Fetch user data and repositories for language calculation
    const [userResponse, reposResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&type=owner`)
    ]);

    if (!userResponse.ok || !reposResponse.ok) {
        throw new Error('Failed to fetch GitHub data from API');
    }

    const user = await userResponse.json();
    const repos = await reposResponse.json();

    console.log(`Loaded ${repos.length} repositories from API`);

    // Calculate top languages from repositories
    const languages = {};
    let processedRepos = 0;
    
    repos.forEach(repo => {
        if (repo.language) { // Count all repos with languages (including forks)
            languages[repo.language] = (languages[repo.language] || 0) + repo.stargazers_count + 1;
            processedRepos++;
        }
    });

    console.log(`Processed ${processedRepos} repositories with languages`);
    console.log('Language counts:', languages);

    // Get top 6 languages sorted by usage (stars + count)
    const sortedLanguages = Object.entries(languages).sort(([,a], [,b]) => b - a);
    const topLanguages = sortedLanguages.slice(0, 6).map(([lang]) => ({ name: lang }));
    
    updateLanguagesDisplay(topLanguages);
}

async function loadOrganizationsFromAPI(username) {
    const orgsResponse = await fetch(`https://api.github.com/users/${username}/orgs`);
    
    if (!orgsResponse.ok) {
        throw new Error('Failed to fetch organizations');
    }
    
    const orgs = await orgsResponse.json();
    
    // Update organizations
    const orgsContainer = document.getElementById('github-organizations');
    if (orgsContainer) {
        if (orgs.length > 0) {
            console.log('Organizations data:', orgs);
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
}

async function loadBioFromAPI(username) {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    
    if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
    }
    
    const user = await userResponse.json();
    
    // Update bio if available
    const bioContainer = document.getElementById('github-bio');
    if (bioContainer && user.bio) {
        bioContainer.textContent = user.bio;
        console.log('Updated bio:', user.bio);
    }
}

function updateLanguagesDisplay(languages) {
    const languagesContainer = document.getElementById('github-languages');
    if (languagesContainer) {
        if (languages && languages.length > 0) {
            languagesContainer.innerHTML = languages.map(lang => 
                `<span class="sidebar-language-tag">${lang.name}</span>`
            ).join('');
            console.log('Updated languages display with:', languages.map(l => l.name));
        } else {
            // Fallback if no languages found
            setFallbackLanguages();
        }
    }
}

function setFallbackContent() {
    setFallbackLanguages();
    setFallbackOrganizations();
}

function setFallbackLanguages() {
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
}

function setFallbackOrganizations() {
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