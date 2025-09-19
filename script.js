// Configuration
// Last updated: 2025-09-19 - Blog debugging version
const CONFIG = {
    username: 'kitzy',
    repositories: {
        about: 'kitzy.github.io', // Changed to use this repository
        readme: 'kitzy.github.io' // Changed to use this repository
    },
    api: {
        featuredProjects: [
            // Just add repository names here - everything else auto-populates!
            'fleet-gitops',
            'docker-fleetdm-stack',
            'fleet-autopkg-recipes',
            '/fleetdm/fleet'
        ]
    }
};

// GitHub API base URL
const GITHUB_API = 'https://api.github.com';

// Application state
let currentTab = 'about';
let userData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for marked library to load
    await waitForMarked();
    
    // Handle initial URL hash
    handleInitialRoute();
    
    setupEventListeners();
    await loadUserData();
    await loadGitHubStats();
    await loadSidebarData(); // Load sidebar data independent of tab
    await loadTabContent();
});

// Handle URL routing on page load
function handleInitialRoute() {
    console.log('handleInitialRoute called with:', {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash
    });
    
    // Check for route parameter from 404 redirect first
    const urlParams = new URLSearchParams(window.location.search);
    const routeParam = urlParams.get('route');
    
    if (routeParam) {
        // Handle blog post routes (blog/post-slug)
        if (routeParam.startsWith('blog/')) {
            console.log('Blog post route parameter:', routeParam);
            currentTab = 'blog';
            updateUIForTab('blog');
            
            // Extract post slug and store for later loading
            const postSlug = routeParam.substring(5); // Remove 'blog/'
            if (postSlug) {
                window.pendingBlogPost = postSlug;
            }
            
            // Clean up the URL by replacing with clean path
            window.history.replaceState(null, null, `/${routeParam}${window.location.hash}`);
            return;
        }
        // Handle regular routes
        else if (['about', 'readme', 'projects', 'blog'].includes(routeParam)) {
            console.log('Using route parameter:', routeParam);
            currentTab = routeParam;
            updateUIForTab(routeParam);
            
            // Clean up the URL by replacing with clean path
            window.history.replaceState(null, null, `/${routeParam}${window.location.hash}`);
            
            // Handle any hash anchor
            const hash = window.location.hash.substring(1);
            if (hash) {
                window.pendingScrollTarget = hash;
            }
            return;
        }
    }
    
    // Check for clean URLs (/about, /readme, etc.)
    const path = window.location.pathname;
    const cleanRoute = path.substring(1); // Remove leading slash
    const hash = window.location.hash.substring(1); // Get any hash/anchor
    
    // Handle blog post URLs like /blog/post-slug
    if (cleanRoute.startsWith('blog/')) {
        console.log('Blog post URL detected:', cleanRoute);
        currentTab = 'blog';
        updateUIForTab('blog');
        
        // Extract post slug and store for later loading
        const postSlug = cleanRoute.substring(5); // Remove 'blog/'
        if (postSlug) {
            window.pendingBlogPost = postSlug;
        }
        return;
    }
    
    if (cleanRoute && ['about', 'readme', 'projects', 'blog'].includes(cleanRoute)) {
        console.log('Using clean route:', cleanRoute);
        currentTab = cleanRoute;
        
        // Update the UI to match the URL
        updateUIForTab(cleanRoute);
        
        // Store section to scroll to after content loads
        if (hash) {
            window.pendingScrollTarget = hash;
        }
        return;
    }
    
    // Fallback to hash-based routing (for backwards compatibility)
    const hashPath = window.location.hash.substring(1); // Remove the #
    const [tabPart, sectionPart] = hashPath.split('#');
    
    if (tabPart && ['about', 'readme', 'projects', 'blog'].includes(tabPart)) {
        console.log('Using hash route:', tabPart);
        currentTab = tabPart;
        
        // Update the UI to match the URL and migrate to clean URL
        updateUIForTab(tabPart);
        window.history.replaceState(null, null, `/${tabPart}`);
        
        // Store section to scroll to after content loads
        if (sectionPart) {
            window.pendingScrollTarget = sectionPart;
        }
        return;
    }
    
    // If no route matched, check if we're at root and default to about
    if (window.location.pathname === '/' || window.location.pathname === '') {
        console.log('Defaulting to about page');
        currentTab = 'about';
        updateUIForTab('about');
        window.history.replaceState(null, null, '/about');
    } else {
        console.log('No route matched, staying with current tab:', currentTab);
    }
}

// Update UI elements for the given tab
function updateUIForTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    // Update active tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    const targetPane = document.getElementById(`${tabName}-content`);
    if (targetPane) {
        targetPane.classList.add('active');
    }
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    const [tabPart, sectionPart] = hash.split('#');
    
    if (tabPart && ['about', 'readme', 'projects', 'blog'].includes(tabPart) && tabPart !== currentTab) {
        switchTab(tabPart);
    }
    
    // Handle section scrolling
    if (sectionPart) {
        setTimeout(() => {
            const element = document.getElementById(sectionPart);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
});

// Listen for browser back/forward navigation
window.addEventListener('popstate', () => {
    handleInitialRoute();
    loadTabContent();
});

// Wait for marked library to be available
function waitForMarked() {
    return new Promise((resolve) => {
        if (typeof marked !== 'undefined') {
            resolve();
            return;
        }
        
        // Check every 100ms for marked to be available
        const checkInterval = setInterval(() => {
            if (typeof marked !== 'undefined') {
                clearInterval(checkInterval);
                resolve();
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            console.warn('Marked library not loaded, using fallback renderer');
            resolve();
        }, 5000);
    });
}

// Event listeners
function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            mobileToggle.classList.remove('active');
        }
    });
}

// Load user data from GitHub API
async function loadUserData() {
    try {
        const response = await fetch(`${GITHUB_API}/users/${CONFIG.username}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        userData = await response.json();
        displayUserData();
    } catch (error) {
        console.error('Error loading user data:', error);
        displayUserError();
    }
}

// Display user data in the sidebar
function displayUserData() {
    if (!userData) return;

    // Basic profile info
    document.getElementById('avatar').src = userData.avatar_url;
    document.getElementById('avatar').alt = `${userData.name || userData.login}'s avatar`;
    document.getElementById('name').textContent = userData.name || userData.login;
    
    // Use fallback bio if none provided
    const fallbackBio = 'Always automating, always iterating, always helping others.';
    document.getElementById('bio').textContent = userData.bio || fallbackBio;

    // Profile details (only show if available)
    updateDetailItem('company', null); // Hide company info
    updateDetailItem('location', userData.location);
    updateDetailItem('email', userData.email);
}

// Update a detail item in the profile
function updateDetailItem(id, value) {
    const element = document.getElementById(id);
    if (!value) {
        element.style.display = 'none';
        return;
    }

    element.style.display = 'flex';
    const text = element.querySelector('.detail-text');
    text.textContent = value;
}

// Display user data loading error
function displayUserError() {
    document.getElementById('name').textContent = 'Kitzy';
    document.getElementById('bio').textContent = 'Always automating, always iterating, always helping others.';
    
    // Show basic info even if API fails
    updateDetailItem('company', null); // Hide company info
    updateDetailItem('location', null); // Hide if no data
    updateDetailItem('email', null); // Hide if no data
}

// Load GitHub stats data
async function loadGitHubStats() {
    try {
        console.log('Loading GitHub stats...');
        
        // Get user data for basic stats
        const userResponse = await fetch(`${GITHUB_API}/users/${CONFIG.username}`);
        if (!userResponse.ok) {
            throw new Error(`User API failed: ${userResponse.status}`);
        }
        const userData = await userResponse.json();
        console.log('User data loaded:', userData);
        
        // Get repositories for star count
        const reposResponse = await fetch(`${GITHUB_API}/users/${CONFIG.username}/repos?per_page=100`);
        if (!reposResponse.ok) {
            throw new Error(`Repos API failed: ${reposResponse.status}`);
        }
        const repos = await reposResponse.json();
        console.log('Repos loaded:', repos.length);
        
        // Calculate total stars
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        console.log('Total stars calculated:', totalStars);
        
        // Update stats display
        const publicReposEl = document.getElementById('public-repos');
        const followersEl = document.getElementById('followers');
        const followingEl = document.getElementById('following');
        const totalStarsEl = document.getElementById('total-stars');
        
        if (publicReposEl) publicReposEl.textContent = userData.public_repos || 0;
        if (followersEl) followersEl.textContent = userData.followers || 0;
        if (followingEl) followingEl.textContent = userData.following || 0;
        if (totalStarsEl) totalStarsEl.textContent = totalStars || 0;
        
        console.log('GitHub stats updated successfully');
        
    } catch (error) {
        console.error('Error loading GitHub stats:', error);
        displayStatsError();
    }
}

// Display stats loading error
function displayStatsError() {
    document.getElementById('public-repos').textContent = '-';
    document.getElementById('followers').textContent = '-';
    document.getElementById('following').textContent = '-';
    document.getElementById('total-stars').textContent = '-';
}

// Load sidebar data (languages and organizations)
async function loadSidebarData() {
    try {
        console.log('Loading sidebar data...');
        
        // Fetch organizations and repositories
        const [orgsResponse, reposResponse] = await Promise.all([
            fetch(`${GITHUB_API}/users/${CONFIG.username}/orgs`),
            fetch(`${GITHUB_API}/users/${CONFIG.username}/repos?per_page=100&sort=updated`)
        ]);
        
        const orgs = orgsResponse.ok ? await orgsResponse.json() : [];
        const repos = reposResponse.ok ? await reposResponse.json() : [];
        
        console.log('Sidebar data loaded:', { orgs: orgs.length, repos: repos.length });
        
        // Calculate top languages
        const languages = repos
            .filter(repo => repo.language)
            .reduce((acc, repo) => {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
                return acc;
            }, {});
        
        const topLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([lang]) => lang);
        
        // Populate sidebar sections
        populateSidebarLanguages(topLanguages);
        populateSidebarOrganizations(orgs);
        
        console.log('Sidebar data populated successfully');
        
    } catch (error) {
        console.error('Error loading sidebar data:', error);
        // Show empty sections if loading fails
        const languagesContainer = document.getElementById('sidebar-languages');
        const orgsContainer = document.getElementById('sidebar-organizations');
        if (languagesContainer) languagesContainer.innerHTML = '';
        if (orgsContainer) orgsContainer.innerHTML = '';
    }
}

// Load GitHub organizations and stats for the about section
async function loadGitHubOrganizations(container) {
    try {
        // Fetch organizations and user data in parallel
        const [orgsResponse, userResponse, reposResponse, eventsResponse] = await Promise.all([
            fetch(`${GITHUB_API}/users/${CONFIG.username}/orgs`),
            fetch(`${GITHUB_API}/users/${CONFIG.username}`),
            fetch(`${GITHUB_API}/users/${CONFIG.username}/repos?per_page=100&sort=updated`),
            fetch(`${GITHUB_API}/users/${CONFIG.username}/events/public?per_page=30`)
        ]);
        
        const orgs = orgsResponse.ok ? await orgsResponse.json() : [];
        const user = userResponse.ok ? await userResponse.json() : null;
        const repos = reposResponse.ok ? await reposResponse.json() : [];
        const events = eventsResponse.ok ? await eventsResponse.json() : [];
        
        console.log('GitHub data loaded:', { orgs, user, repos: repos.length, events: events.length });
        
        // Calculate additional stats
        const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
        const totalForks = repos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0);
        const languages = repos
            .filter(repo => repo.language)
            .reduce((acc, repo) => {
                acc[repo.language] = (acc[repo.language] || 0) + 1;
                return acc;
            }, {});
        
        const topLanguages = Object.entries(languages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([lang]) => lang);
        
        // Recent activity - last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentEvents = events.filter(event => new Date(event.created_at) > oneWeekAgo);
        
        // Create simplified stats section for About page
        const statsHTML = `
            <div class="github-section">
                <h3 class="github-section-title">Stats</h3>
                
                <div class="github-stats-grid">
                    <a href="https://github.com/${CONFIG.username}?tab=repositories" target="_blank" class="stat-card">
                        <div class="stat-number">${user?.public_repos || 0}</div>
                        <div class="stat-label">Public Repos</div>
                    </a>
                    <a href="https://github.com/${CONFIG.username}?tab=followers" target="_blank" class="stat-card">
                        <div class="stat-number">${user?.followers || 0}</div>
                        <div class="stat-label">Followers</div>
                    </a>
                    <a href="https://github.com/${CONFIG.username}?tab=following" target="_blank" class="stat-card">
                        <div class="stat-number">${user?.following || 0}</div>
                        <div class="stat-label">Following</div>
                    </a>
                    <a href="https://github.com/${CONFIG.username}?tab=repositories" target="_blank" class="stat-card">
                        <div class="stat-number">${totalStars}</div>
                        <div class="stat-label">Total Stars</div>
                    </a>
                    <a href="https://github.com/${CONFIG.username}?tab=repositories" target="_blank" class="stat-card">
                        <div class="stat-number">${totalForks}</div>
                        <div class="stat-label">Total Forks</div>
                    </a>
                    <a href="https://github.com/${CONFIG.username}" target="_blank" class="stat-card">
                        <div class="stat-number">${recentEvents.length}</div>
                        <div class="stat-label">Recent Activity</div>
                        <div class="stat-subtitle">(7 days)</div>
                    </a>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', statsHTML);
        
    } catch (error) {
        console.error('Error loading GitHub data:', error);
        // Silently fail - don't show error if we can't load GitHub data
    }
}

// Populate sidebar languages section
function populateSidebarLanguages(languages) {
    const container = document.getElementById('sidebar-languages');
    if (!container || languages.length === 0) return;
    
    const languagesHTML = `
        <h3 class="sidebar-section-title">Top Languages</h3>
        <div class="sidebar-languages-list">
            ${languages.map(lang => `
                <span class="sidebar-language-tag">${lang}</span>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = languagesHTML;
}

// Populate sidebar organizations section
function populateSidebarOrganizations(orgs) {
    const container = document.getElementById('sidebar-organizations');
    if (!container || orgs.length === 0) return;
    
    const orgsHTML = `
        <h3 class="sidebar-section-title">Organizations</h3>
        <div class="sidebar-organizations-list">
            ${orgs.map(org => `
                <a href="${org.html_url || `https://github.com/${org.login}`}" 
                   target="_blank" 
                   class="sidebar-org-link"
                   title="${org.login}${org.description ? ': ' + org.description : ''}">
                    <img src="${org.avatar_url}" alt="${org.login}" class="sidebar-org-icon">
                </a>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = orgsHTML;
}



// Switch between tabs
function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}-content`).classList.add('active');

    currentTab = tabName;
    
    // Reset meta tags to default site values when leaving a blog post
    if (tabName !== 'blog') {
        updateSocialPreview('Kitzy', 'Documenting my journey in Computer Science'); // Reset to site defaults
    }
    
    // Update URL with clean path (no hash)
    window.history.pushState(null, null, `/${tabName}`);
    
    loadTabContent();
}

// Load content for the current tab
async function loadTabContent() {
    switch (currentTab) {
        case 'about':
            await loadMarkdownContent('about', CONFIG.repositories.about, 'ABOUT.md');
            break;
        case 'readme':
            await loadMarkdownContent('readme', CONFIG.repositories.readme, 'README.md');
            break;
        case 'projects':
            await loadProjectsContent();
            break;
        case 'blog':
            await loadBlogContent();
            break;
    }
}

// Load markdown content from GitHub
async function loadMarkdownContent(tabId, repo, filename) {
    const container = document.getElementById(`${tabId}-content`);
    container.innerHTML = '<div class="loading">Loading content...</div>';
    
    try {
        let content;
        
        // Try local file first (for local development)
        try {
            const localResponse = await fetch(filename);
            if (localResponse.ok) {
                content = await localResponse.text();
                console.log('Successfully loaded from local file');
            } else {
                throw new Error('Local file not found');
            }
        } catch (localError) {
            // Try direct raw content URL (avoids base64 encoding issues)
            const rawUrl = `https://raw.githubusercontent.com/${CONFIG.username}/${repo}/main/${filename}`;
            console.log('Trying raw URL:', rawUrl);
            
            try {
                const rawResponse = await fetch(rawUrl);
                if (rawResponse.ok) {
                    content = await rawResponse.text();
                    console.log('Successfully loaded from raw URL');
                } else {
                    throw new Error('Raw URL failed, trying API');
                }
            } catch (rawError) {
                console.log('Raw URL failed, falling back to GitHub API');
                // Fallback to GitHub API
                const response = await fetch(`${GITHUB_API}/repos/${CONFIG.username}/${repo}/contents/${filename}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log('GitHub API response type:', data.type);
                console.log('Content encoding:', data.encoding);
                
                // Properly decode base64 content with UTF-8 support
                try {
                    if (data.encoding === 'base64') {
                        // Use TextDecoder for proper UTF-8 handling
                        const binaryString = atob(data.content);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let i = 0; i < binaryString.length; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        const decoder = new TextDecoder('utf-8');
                        content = decoder.decode(bytes);
                    } else {
                        content = data.content;
                    }
                } catch (error) {
                    console.error('Error decoding content:', error);
                    // Fallback to simple atob
                    content = atob(data.content);
                }
            }
        }
        
        console.log('Decoded content preview:', content.substring(0, 100) + '...');
        
        // Check if marked is available and convert markdown to HTML
        let html;
        if (typeof marked !== 'undefined' && marked.parse) {
            html = marked.parse(content);
        } else if (typeof marked !== 'undefined') {
            // Fallback for older versions of marked
            html = marked(content);
        } else {
            // Fallback: basic markdown-like formatting
            html = convertBasicMarkdown(content);
        }
        
        container.innerHTML = `<div class="markdown-content">${html}</div>`;
        
        // Add anchor links to headings
        addHeadingAnchors(container);
        
        // Handle pending scroll target
        if (window.pendingScrollTarget) {
            setTimeout(() => {
                const element = document.getElementById(window.pendingScrollTarget);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
                window.pendingScrollTarget = null;
            }, 100);
        }
        
        // If this is the about tab, add GitHub organizations section
        if (tabId === 'about') {
            await loadGitHubOrganizations(container);
        }
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        container.innerHTML = `
            <div class="error">
                <h3>Unable to load ${filename}</h3>
                <p>Error: ${error.message}</p>
                <p>Make sure the file exists in the repository and try refreshing the page.</p>
            </div>
        `;
    }
}

// Basic markdown converter as fallback
function convertBasicMarkdown(text) {
    return text
        // Escape any existing HTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Headers
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        // Bold
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        // Links
        .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank">$1</a>')
        // Code blocks (must come before inline code)
        .replace(/```([^`]*)```/gims, '<pre><code>$1</code></pre>')
        // Inline code
        .replace(/`([^`]*)`/gim, '<code>$1</code>')
        // Lists
        .replace(/^\* (.*)$/gim, '<li>$1</li>')
        .replace(/^- (.*)$/gim, '<li>$1</li>')
        // Wrap consecutive list items in ul
        .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
        // Fix multiple ul tags
        .replace(/<\/ul>\s*<ul>/gim, '')
        // Line breaks and paragraphs
        .split('\n\n')
        .map(paragraph => {
            if (paragraph.trim() === '') return '';
            if (paragraph.includes('<h') || paragraph.includes('<ul') || paragraph.includes('<pre')) {
                return paragraph;
            }
            return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        })
        .join('\n');
}

// Load projects content
async function loadProjectsContent() {
    const container = document.getElementById('projects-content');
    container.innerHTML = '<div class="projects-loading">Loading featured projects...</div>';
    
    try {
        const projects = await Promise.all(
            CONFIG.api.featuredProjects.map(async (repoName) => {
                try {
                    // Handle both personal repos (just repo name) and org repos (org/repo)
                    const repoPath = repoName.startsWith('/') ? 
                        repoName.substring(1) : // Remove leading slash for org repos
                        `${CONFIG.username}/${repoName}`; // Add username for personal repos
                    
                    const response = await fetch(`${GITHUB_API}/repos/${repoPath}`);
                    if (response.ok) {
                        return await response.json();
                    }
                    return null;
                } catch (error) {
                    console.error(`Error fetching ${repoName}:`, error);
                    return null;
                }
            })
        );

        // Filter out failed requests
        const validProjects = projects.filter(project => project !== null);
        
        if (validProjects.length > 0) {
            displayProjects(validProjects);
        } else {
            displayProjectsError('No projects could be loaded');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        displayProjectsError('Failed to load projects');
    }
}

// Display projects in grid layout
function displayProjects(projects) {
    const container = document.getElementById('projects-content');
    
    let html = `
        <div class="projects-header">
            <h2 class="projects-title">Github Projects</h2>
            <p class="projects-subtitle">Showcasing ${projects.length} featured repositories</p>
        </div>
        <div class="projects-grid">
    `;

    projects.forEach(project => {
        const languageClass = project.language ? project.language.toLowerCase().replace(/[^a-z]/g, '') : '';
        const updatedDate = new Date(project.updated_at).toLocaleDateString();
        
        html += `
            <div class="project-card">
                <div class="project-header">
                    <svg class="project-icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"/>
                    </svg>
                    <a href="${project.html_url}" target="_blank" class="project-name">${project.name}</a>
                    <span class="project-visibility">${project.private ? 'Private' : 'Public'}</span>
                </div>
                <p class="project-description">${project.description || 'No description available'}</p>
                <div class="project-stats">
                    <div class="project-stat">
                        <svg class="project-stat-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                        </svg>
                        <span>${project.stargazers_count}</span>
                    </div>
                    <div class="project-stat">
                        <svg class="project-stat-icon" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878z"/>
                        </svg>
                        <span>${project.forks_count}</span>
                    </div>
                    ${project.language ? `
                        <div class="project-language">
                            <div class="language-color ${languageClass}"></div>
                            <span>${project.language}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

// Display projects error
function displayProjectsError(message) {
    const container = document.getElementById('projects-content');
    container.innerHTML = `
        <div class="projects-error">
            <h3>Unable to load projects</h3>
            <p>${message}</p>
            <p>Please check your internet connection and try again.</p>
        </div>
    `;
}

// Load blog content
async function loadBlogContent() {
    const container = document.getElementById('blog-content');
    
    try {
        // Try local blog folder first (for local development)
        let files;
        try {
            const localResponse = await fetch('/blog/');
            if (localResponse.ok) {
                // For local development, we need to manually list the files
                // Since we know there's at least one file, let's try to load it directly
                const knownPosts = ['first-week-at-fleet.md']; // We can expand this list
                files = knownPosts.map(name => ({ name, download_url: `/blog/${name}` }));
                console.log('Using local blog files');
            } else {
                throw new Error('Local blog folder not accessible');
            }
        } catch (localError) {
            // For production, use multiple fallback strategies
            console.log('Local files not accessible, trying multiple fallback strategies');
            const knownPosts = ['first-week-at-fleet.md']; // Add more posts here as needed
            
            // Try different approaches for fetching blog content
            files = knownPosts.map(name => ({ 
                name, 
                download_url: `/blog/${name}` // Use absolute path to avoid double /blog/blog/
            }));
            
            // Also add raw GitHub URLs as backup
            const githubFiles = knownPosts.map(name => ({ 
                name, 
                download_url: `https://raw.githubusercontent.com/${CONFIG.username}/${CONFIG.repositories.about}/main/blog/${name}` 
            }));
            
            // Test if any of these work
            let workingFiles = [];
            for (const fileGroup of [files, githubFiles]) {
                for (const file of fileGroup) {
                    try {
                        const testResponse = await fetch(file.download_url);
                        if (testResponse.ok) {
                            console.log(`Working URL found: ${file.download_url}`);
                            workingFiles.push(file);
                            break; // Found a working approach, use it
                        }
                    } catch (e) {
                        console.log(`Failed URL: ${file.download_url}`);
                    }
                }
                if (workingFiles.length > 0) break; // Found working files
            }
            
            files = workingFiles.length > 0 ? workingFiles : files; // Use working files or fallback
            
            // Still try GitHub API as backup, but don't fail if it doesn't work
            try {
                console.log('Also trying GitHub API for blog posts');
                console.log('API URL:', `${GITHUB_API}/repos/${CONFIG.username}/${CONFIG.repositories.about}/contents/blog`);
                const response = await fetch(`${GITHUB_API}/repos/${CONFIG.username}/${CONFIG.repositories.about}/contents/blog`);
                
                console.log('GitHub API response status:', response.status);
                if (response.ok) {
                    const apiFiles = await response.json();
                    console.log('GitHub API files:', apiFiles);
                    const apiMarkdownFiles = apiFiles.filter(file => file.name.endsWith('.md'));
                    console.log('Filtered markdown files from API:', apiMarkdownFiles);
                    // Use API files if available, otherwise stick with working files
                    if (apiMarkdownFiles.length > 0) {
                        files = apiMarkdownFiles;
                    }
                } else {
                    const errorText = await response.text();
                    console.warn('GitHub API not accessible:', response.status, errorText);
                }
            } catch (apiError) {
                console.warn('GitHub API failed, using fallback files:', apiError);
            }
        }
        
        if (files && files.length > 0) {
            await displayBlogPosts(files);
            
            // Check if there's a pending blog post to load
            if (window.pendingBlogPost) {
                const filename = `${window.pendingBlogPost}.md`;
                await loadBlogPost(filename);
                window.pendingBlogPost = null; // Clear the pending post
            }
        } else {
            displayNoBlogPosts();
        }
    } catch (error) {
        console.error('Error loading blog content:', error);
        displayNoBlogPosts();
    }
}

// Display blog posts
async function displayBlogPosts(files) {
    const container = document.getElementById('blog-content');
    let html = '<div class="blog-post-list">';

    for (const file of files) {
        try {
            const response = await fetch(file.download_url);
            const content = await response.text();
            
            console.log(`Processing blog post: ${file.name}`);
            console.log(`Content preview:`, content.substring(0, 200));
            
            // Extract title from first heading (H1) or filename as fallback
            const lines = content.split('\n');
            let title = file.name.replace('.md', '').replace(/[-_]/g, ' '); // Default fallback
            
            console.log(`Lines preview:`, lines.slice(0, 5));
            
            // Look for the first H1 heading (# Title)
            const firstHeadingLine = lines.find(line => line.trim().startsWith('# '));
            console.log(`First heading line found:`, firstHeadingLine);
            
            if (firstHeadingLine) {
                title = firstHeadingLine.replace(/^#+\s*/, '').trim();
                console.log(`Extracted title: "${title}"`);
            } else {
                console.log(`No H1 found, using filename title: "${title}"`);
            }
            
            // Extract excerpt (first paragraph after title/headings)
            const excerpt = lines
                .filter(line => line.trim() && !line.startsWith('#'))
                .find(line => line.trim())?.trim() || '';
            
            // Get file date (using current date for now - could be enhanced to use git commit date)
            const date = new Date().toLocaleDateString();
            
            // Create URL slug from filename
            const slug = file.name.replace('.md', '');
            
            html += `
                <div class="blog-post-item">
                    <a href="/blog/${slug}" class="blog-post-title" data-file="${file.name}" data-slug="${slug}">${title}</a>
                    <div class="blog-post-meta">Published on ${date}</div>
                    <div class="blog-post-excerpt">${excerpt}</div>
                </div>
            `;
        } catch (error) {
            console.error(`Error loading blog post ${file.name}:`, error);
        }
    }

    html += '</div>';
    container.innerHTML = html;

    // Add click handlers for blog post titles
    container.querySelectorAll('.blog-post-title').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const filename = e.target.dataset.file;
            const slug = e.target.dataset.slug;
            
            // Update URL
            window.history.pushState(null, null, `/blog/${slug}`);
            
            // Load the blog post
            await loadBlogPost(filename);
        });
    });
}

// Update social preview meta tags dynamically
function updateSocialPreview(title, description = "Always automating, always iterating, always helping others.", image = "https://github.com/kitzy.png") {
    // Update document title
    document.title = title;
    
    // Update or create meta tags
    const metaTags = [
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
        { name: 'description', content: description }
    ];
    
    metaTags.forEach(tag => {
        let selector = tag.property ? `meta[property="${tag.property}"]` : `meta[name="${tag.name}"]`;
        let element = document.querySelector(selector);
        
        if (element) {
            element.setAttribute('content', tag.content);
        } else {
            // Create the meta tag if it doesn't exist
            element = document.createElement('meta');
            if (tag.property) {
                element.setAttribute('property', tag.property);
            } else {
                element.setAttribute('name', tag.name);
            }
            element.setAttribute('content', tag.content);
            document.head.appendChild(element);
        }
    });
    
    console.log(`Updated social preview: ${title}`);
}

// Back to blog function - updates URL and loads blog list
function backToBlog() {
    // Reset meta tags to default site values
    updateSocialPreview('Kitzy');
    
    // Update URL back to /blog
    window.history.pushState(null, null, '/blog');
    
    // Load the blog list content
    loadBlogContent();
}

// Load individual blog post
async function loadBlogPost(filename) {
    const container = document.getElementById('blog-content');
    
    try {
        let content;
        
        // Try local file first (for local development)
        try {
            const localResponse = await fetch(`/blog/${filename}`);
            if (localResponse.ok) {
                content = await localResponse.text();
                console.log('Successfully loaded blog post from local file');
            } else {
                throw new Error('Local blog post not found');
            }
        } catch (localError) {
            console.log('Trying direct raw GitHub URL for blog post');
            try {
                // Try raw GitHub URL first (more reliable for public repos)
                const rawUrl = `https://raw.githubusercontent.com/${CONFIG.username}/${CONFIG.repositories.about}/main/blog/${filename}`;
                console.log('Raw URL:', rawUrl);
                const rawResponse = await fetch(rawUrl);
                if (rawResponse.ok) {
                    content = await rawResponse.text();
                    console.log('Successfully loaded blog post from raw URL');
                } else {
                    throw new Error('Raw URL failed');
                }
            } catch (rawError) {
                console.log('Raw URL failed, trying GitHub API for blog post');
                console.log('API URL:', `${GITHUB_API}/repos/${CONFIG.username}/${CONFIG.repositories.about}/contents/blog/${filename}`);
                // Fallback to GitHub API
                const response = await fetch(`${GITHUB_API}/repos/${CONFIG.username}/${CONFIG.repositories.about}/contents/blog/${filename}`);
                console.log('GitHub API response status for blog post:', response.status);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('GitHub API error for blog post:', response.status, errorText);
                    throw new Error(`Failed to fetch ${filename}: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Blog post data from API:', data);
                content = atob(data.content);
            }
        }
        
        // Extract blog post title for social preview
        const lines = content.split('\n');
        let blogTitle = filename.replace('.md', '').replace(/[-_]/g, ' '); // Default fallback
        
        // Look for the first H1 heading (# Title)
        const firstHeadingLine = lines.find(line => line.trim().startsWith('# '));
        if (firstHeadingLine) {
            blogTitle = firstHeadingLine.replace(/^#+\s*/, '').trim();
        }
        
        // Update social preview meta tags for this blog post
        updateSocialPreview(`Kitzy - ${blogTitle}`);
        
        // Check if marked is available and convert markdown to HTML
        let html;
        if (typeof marked !== 'undefined' && marked.parse) {
            html = marked.parse(content);
        } else if (typeof marked !== 'undefined') {
            // Fallback for older versions of marked
            html = marked(content);
        } else {
            // Fallback: basic markdown-like formatting
            html = convertBasicMarkdown(content);
        }
        
        container.innerHTML = `
            <div class="markdown-content">
                <button onclick="backToBlog()" style="margin-bottom: 16px; background: #21262d; color: #e6edf3; border: 1px solid #30363d; border-radius: 6px; padding: 8px 16px; cursor: pointer;">← Back to Blog</button>
                ${html}
            </div>
        `;
    } catch (error) {
        console.error(`Error loading blog post ${filename}:`, error);
        container.innerHTML = '<div class="error">Unable to load blog post</div>';
    }
}

// Display message when no blog posts are found
function displayNoBlogPosts() {
    const container = document.getElementById('blog-content');
    container.innerHTML = `
        <div class="markdown-content">
            <h2>Blog</h2>
            <p>No blog posts found. Create markdown files in the <code>blog/</code> folder to get started!</p>
            <p>Blog posts should be stored as <code>.md</code> files in the <code>blog</code> directory of this repository.</p>
        </div>
    `;
}

// Add anchor links to headings
function addHeadingAnchors(container) {
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headings.forEach(heading => {
        // Create a slug from the heading text
        const slug = createSlug(heading.textContent);
        heading.id = slug;
        
        // Create the anchor link
        const anchor = document.createElement('a');
        anchor.href = `/${currentTab}#${slug}`;
        anchor.className = 'heading-anchor';
        anchor.innerHTML = '🔗';
        anchor.title = 'Copy link to this section';
        anchor.setAttribute('aria-label', 'Link to this section');
        
        // Add click handler for URL update and clipboard copy
        anchor.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Update URL with clean path and hash
            window.history.pushState(null, null, `/${currentTab}#${slug}`);
            
            // Copy full URL to clipboard
            const fullUrl = `${window.location.origin}/${currentTab}#${slug}`;
            try {
                await navigator.clipboard.writeText(fullUrl);
                
                // Show brief feedback
                const originalText = anchor.innerHTML;
                anchor.innerHTML = '✅';
                setTimeout(() => {
                    anchor.innerHTML = originalText;
                }, 1000);
            } catch (err) {
                console.error('Failed to copy URL:', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = fullUrl;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = anchor.innerHTML;
                anchor.innerHTML = '✅';
                setTimeout(() => {
                    anchor.innerHTML = originalText;
                }, 1000);
            }
        });
        
        // Add the anchor to the heading
        heading.appendChild(anchor);
    });
}

// Create URL-friendly slug from text
function createSlug(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Error handling for network issues
window.addEventListener('online', () => {
    console.log('Connection restored, reloading data...');
    loadUserData();
    loadContributions();
    loadTabContent();
});

window.addEventListener('offline', () => {
    console.log('Connection lost');
});