// Configuration
const CONFIG = {
    username: 'kitzy',
    repositories: {
        readme: 'kitzy.github.io', // Changed to use this repository
        usermanual: 'kitzy.github.io' // Changed to use this repository
    },
    contributions: {
        months: 3 // Number of months to show in contributions grid
    }
};

// GitHub API base URL
const GITHUB_API = 'https://api.github.com';

// Application state
let currentTab = 'readme';
let userData = null;
let contributionsData = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadUserData();
    await loadContributions();
    await loadTabContent();
});

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
    document.getElementById('username').textContent = `@${userData.login}`;
    document.getElementById('bio').textContent = userData.bio || '';

    // Stats
    document.getElementById('followers').textContent = userData.followers || 0;
    document.getElementById('following').textContent = userData.following || 0;

    // Profile details
    updateDetailItem('company', userData.company);
    updateDetailItem('location', userData.location);
    updateDetailItem('email', userData.email);
    updateDetailItem('website', userData.blog);
    updateDetailItem('twitter', userData.twitter_username);
}

// Update a detail item in the profile
function updateDetailItem(id, value) {
    const element = document.getElementById(id);
    if (!value) {
        element.style.display = 'none';
        return;
    }

    element.style.display = 'flex';
    
    if (id === 'website' || id === 'twitter') {
        const link = element.querySelector('.detail-link');
        if (id === 'website') {
            link.href = value.startsWith('http') ? value : `https://${value}`;
            link.textContent = value;
        } else if (id === 'twitter') {
            link.href = `https://twitter.com/${value}`;
            link.textContent = `@${value}`;
        }
    } else {
        const text = element.querySelector('.detail-text');
        text.textContent = value;
    }
}

// Display user data loading error
function displayUserError() {
    document.getElementById('name').textContent = 'Error loading profile';
    document.getElementById('bio').textContent = 'Unable to fetch user data from GitHub';
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

    // Generate grid for the date range
    const currentDate = new Date(startDate);
    const days = [];

    while (currentDate <= endDate) {
        const day = document.createElement('div');
        day.className = 'contribution-day';
        
        const dateString = currentDate.toDateString();
        const count = contributionMap.get(dateString) || 0;
        
        // Map count to contribution level (0-4)
        let level = 0;
        if (count > 0) level = 1;
        if (count > 2) level = 2;
        if (count > 5) level = 3;
        if (count > 10) level = 4;
        
        day.classList.add(`level-${level}`);
        
        // Add tooltip with date and count
        const dateStr = currentDate.toLocaleDateString();
        day.title = `${dateStr}: ${count} contribution${count !== 1 ? 's' : ''}`;
        
        calendar.appendChild(day);
        currentDate.setDate(currentDate.getDate() + 1);
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
        const response = await fetch(`${GITHUB_API}/repos/${CONFIG.username}/${repo}/contents/${filename}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const content = atob(data.content); // Decode base64 content
        
        // Convert markdown to HTML
        const html = marked.parse(content);
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
        const html = marked.parse(content);
        
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