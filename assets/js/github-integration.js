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
            console.log('✅ Using build-time generated language data');
            console.log('📊 Build-time languages:', window.githubLanguagesData.languages);
            updateLanguagesDisplay(window.githubLanguagesData.languages);
        } else {
            console.log('⚠️ No build-time data available, fetching from API...');
            console.log('🔍 Checking window.githubLanguagesData:', window.githubLanguagesData);
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

    console.log(`📦 Loaded ${repos.length} repositories from API`);

    // Debug: Log all repositories and their languages
    console.log('🔍 All repositories found:');
    repos.forEach(repo => {
        console.log(`  📂 ${repo.name}: ${repo.language || 'No language'} (stars: ${repo.stargazers_count}, fork: ${repo.fork})`);
    });

    // Calculate top languages from repositories
    const languages = {};
    let processedRepos = 0;
    
    repos.forEach(repo => {
        if (repo.language) { // Count all repos with languages (including forks)
            languages[repo.language] = (languages[repo.language] || 0) + repo.stargazers_count + 1;
            processedRepos++;
            console.log(`  ✅ Added ${repo.language} from ${repo.name} (weight: ${repo.stargazers_count + 1})`);
        }
    });

    console.log(`📊 Processed ${processedRepos} repositories with languages`);
    console.log('🎯 Final language counts:', languages);

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
        // Remove @fleetdm from bio and add sponsors badge
        let cleanBio = user.bio.replace(/@fleetdm/g, '').replace(/\s+/g, ' ').trim();
        bioContainer.textContent = cleanBio;
        
        // Add sponsors badge after bio
        addSponsorsBadge(bioContainer);
        
        console.log('Updated bio:', cleanBio);
    }
    
    // Remove any company details that mention Fleet
    removeFleetCompanyDetails();
}

function removeFleetCompanyDetails() {
    // Look for company detail items and remove ones that mention Fleet
    const detailItems = document.querySelectorAll('.detail-item');
    detailItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes('fleet') || text.includes('@fleetdm')) {
            console.log('Removing Fleet company detail:', item.textContent);
            item.style.display = 'none';
        }
    });
}

function addSponsorsBadge(bioContainer) {
    // Remove any existing sponsors badge
    const existingBadge = document.querySelector('.sponsors-badge-container');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Create sponsors badge container
    const sponsorsBadge = document.createElement('div');
    sponsorsBadge.className = 'sponsors-badge-container';
    sponsorsBadge.style.marginTop = '10px';
    sponsorsBadge.innerHTML = `
        <a href="https://github.com/sponsors/kitzy" target="_blank">
            <img src="https://img.shields.io/github/sponsors/kitzy?style=flat&logo=github&logoColor=white&labelColor=gray&color=pink" 
                 alt="GitHub Sponsors" 
                 style="max-width: 100%; height: auto;" />
        </a>
    `;
    
    // Insert after the bio container
    bioContainer.parentNode.insertBefore(sponsorsBadge, bioContainer.nextSibling);
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
    setFallbackBio();
}

function setFallbackLanguages() {
    console.log('🔄 Using fallback language data');
    const languagesContainer = document.getElementById('github-languages');
    if (languagesContainer) {
        languagesContainer.innerHTML = `
            <span class="sidebar-language-tag">JavaScript</span>
            <span class="sidebar-language-tag">TypeScript</span>
            <span class="sidebar-language-tag">Python</span>
            <span class="sidebar-language-tag">Shell</span>
            <span class="sidebar-language-tag">Go</span>
            <span class="sidebar-language-tag">HCL</span>
        `;
        console.log('✅ Fallback languages set successfully');
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

function setFallbackBio() {
    const bioContainer = document.getElementById('github-bio');
    if (bioContainer) {
        // Set fallback bio without @fleetdm mention
        bioContainer.textContent = 'Customer Support Engineer | Infrastructure Nerd | Dog & Motorcycle Lover';
        
        // Add sponsors badge
        addSponsorsBadge(bioContainer);
        
        // Remove Fleet company details
        removeFleetCompanyDetails();
        
        console.log('✅ Fallback bio and sponsors badge set successfully');
    }
}

// Load GitHub data when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGitHubData);
} else {
    // DOM is already loaded
    loadGitHubData();
}