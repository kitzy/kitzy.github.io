// Configuration
const CONFIG = {
    username: 'kitzy',
    repositories: {
        readme: 'kitzy.github.io', // Changed to use this repository
        usermanual: 'kitzy.github.io' // Changed to use this repository
    },
    contributions: {
        months: 3 // Number of months to show in contributions grid
    },
    featuredProjects: [
        // Just add repository names here - everything else auto-populates!
        'fleet',
        'docker-fleetdm-stack',
        'fleet-gitops',
        'fleet-autopkg-recipes',
        'dns',
        'autopkg-runner'
    ]
};

// GitHub API base URL
const GITHUB_API = 'https://api.github.com';

// Application state
let currentTab = 'readme';
let userData = null;
let contributionsData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for marked library to load
    await waitForMarked();
    
    setupEventListeners();
    await loadUserData();
    await loadContributions();
    await loadTabContent();
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
    const fallbackBio = 'Customer Support Engineer at Fleet | Infrastructure Nerd | Dog & Motorcycle Lover';
    document.getElementById('bio').textContent = userData.bio || fallbackBio;

    // Profile details (only show if available)
    updateDetailItem('company', userData.company);
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
    document.getElementById('bio').textContent = 'Customer Support Engineer at Fleet | Infrastructure Nerd | Dog & Motorcycle Lover';
    
    // Show basic info even if API fails
    updateDetailItem('company', 'Fleet');
    updateDetailItem('location', null); // Hide if no data
    updateDetailItem('email', null); // Hide if no data
}

// Load GitHub contributions data
async function loadContributions() {
    try {
        // Calculate date range (last 3 months by default)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - CONFIG.contributions.months);

        // Fetch events from GitHub API to simulate contributions
        const eventsResponse = await fetch(`${GITHUB_API}/users/${CONFIG.username}/events/public?per_page=100`);
        let events = [];
        
        if (eventsResponse.ok) {
            events = await eventsResponse.json();
        }

        createContributionsGrid(startDate, endDate, events);
    } catch (error) {
        console.error('Error loading contributions:', error);
        displayContributionsError();
    }
}

// Create contributions grid
function createContributionsGrid(startDate, endDate, events = []) {
    const container = document.getElementById('contributions-grid');
    const calendar = document.createElement('div');
    calendar.className = 'contributions-calendar';

    // Create a map of dates to contribution counts
    const contributionMap = new Map();
    
    // Process events to count contributions per day
    events.forEach(event => {
        const eventDate = new Date(event.created_at).toDateString();
        contributionMap.set(eventDate, (contributionMap.get(eventDate) || 0) + 1);
    });

    // Calculate the number of weeks to display
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysDiff = Math.ceil((endDate - startDate) / msPerDay);
    const weeks = Math.ceil(daysDiff / 7);
    
    // Set grid to show weeks properly
    calendar.style.display = 'grid';
    calendar.style.gridTemplateColumns = `repeat(${Math.min(weeks, 13)}, 12px)`;
    calendar.style.gridTemplateRows = 'repeat(7, 12px)';
    calendar.style.gap = '2px';
    calendar.style.gridAutoFlow = 'column';

    // Generate grid for the date range, organized by weeks
    const currentDate = new Date(startDate);
    
    // Start from the beginning of the week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const today = new Date();
    const tempDate = new Date(startOfWeek);

    while (tempDate <= endDate) {
        const day = document.createElement('div');
        day.className = 'contribution-day';
        
        const dateString = tempDate.toDateString();
        const count = contributionMap.get(dateString) || 0;
        
        // Map count to contribution level (0-4)
        let level = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 5) level = 3;
        if (count > 10) level = 4;
        
        // Don't show future dates
        if (tempDate > today) {
            level = 0;
            day.style.opacity = '0.3';
        }
        
        day.classList.add(`level-${level}`);
        
        // Add tooltip with date and count
        const dateStr = tempDate.toLocaleDateString();
        day.title = `${dateStr}: ${count} contribution${count !== 1 ? 's' : ''}`;
        
        calendar.appendChild(day);
        tempDate.setDate(tempDate.getDate() + 1);
    }

    container.innerHTML = '';
    container.appendChild(calendar);
}

// Display contributions loading error
function displayContributionsError() {
    const container = document.getElementById('contributions-grid');
    container.innerHTML = '<div class="error">Unable to load contributions</div>';
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
    loadTabContent();
}

// Load content for the current tab
async function loadTabContent() {
    switch (currentTab) {
        case 'readme':
            await loadMarkdownContent('readme', CONFIG.repositories.readme, 'README.md');
            break;
        case 'usermanual':
            await loadMarkdownContent('usermanual', CONFIG.repositories.usermanual, 'USERMANUAL.md');
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
            CONFIG.featuredProjects.map(async (repoName) => {
                try {
                    const response = await fetch(`${GITHUB_API}/repos/${CONFIG.username}/${repoName}`);
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
        // Try to load blog posts from this repository's blog folder
        const response = await fetch(`${GITHUB_API}/repos/${CONFIG.username}/${CONFIG.username}.github.io/contents/blog`);
        
        if (response.ok) {
            const files = await response.json();
            const markdownFiles = files.filter(file => file.name.endsWith('.md'));
            
            if (markdownFiles.length > 0) {
                await displayBlogPosts(markdownFiles);
            } else {
                displayNoBlogPosts();
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
            
            // Extract title from first line or filename
            const lines = content.split('\n');
            const title = lines[0].startsWith('#') ? 
                lines[0].replace('#', '').trim() : 
                file.name.replace('.md', '').replace(/[-_]/g, ' ');
            
            // Extract excerpt (first paragraph after title)
            const excerpt = lines.slice(1).find(line => line.trim() && !line.startsWith('#'))?.trim() || '';
            
            // Get file date (using commit date would be better, but this is simpler)
            const date = new Date(file.sha ? Date.now() : Date.now()).toLocaleDateString();
            
            html += `
                <div class="blog-post-item">
                    <a href="#" class="blog-post-title" data-file="${file.name}">${title}</a>
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
            await loadBlogPost(filename);
        });
    });
}

// Load individual blog post
async function loadBlogPost(filename) {
    const container = document.getElementById('blog-content');
    
    try {
        const response = await fetch(`${GITHUB_API}/repos/${CONFIG.username}/${CONFIG.username}.github.io/contents/blog/${filename}`);
        if (!response.ok) throw new Error(`Failed to fetch ${filename}`);
        
        const data = await response.json();
        const content = atob(data.content);
        
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
                <button onclick="loadBlogContent()" style="margin-bottom: 16px; background: #21262d; color: #e6edf3; border: 1px solid #30363d; border-radius: 6px; padding: 8px 16px; cursor: pointer;">← Back to Blog</button>
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