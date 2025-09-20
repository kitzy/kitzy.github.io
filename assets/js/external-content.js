/**
 * External Repository Content Integration
 * Fetches README content from kitzy/kitzy repository for About page
 */

async function loadExternalAboutContent() {
    const aboutContainer = document.getElementById('external-about-content');
    
    if (!aboutContainer) {
        return; // Only run on pages that have the container
    }
    
    try {
        console.log('Loading About content from kitzy/kitzy repository');
        
        // Fetch README.md from kitzy/kitzy repo
        const response = await fetch('https://api.github.com/repos/kitzy/kitzy/contents/README.md');
        
        if (!response.ok) {
            throw new Error(`GitHub API responded with ${response.status}`);
        }
        
        const data = await response.json();
        
        // Decode base64 content
        const content = atob(data.content);
        
        // Convert markdown to HTML using marked.js (already loaded on page)
        const htmlContent = marked.parse(content);
        
        // Update the container with fetched content
        aboutContainer.innerHTML = htmlContent;
        
        // Fix any relative links to point to the source repo
        const links = aboutContainer.querySelectorAll('a[href^="#"], a[href^="./"], a[href^="../"]');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                // Convert anchor links to point to kitzy.com
                link.setAttribute('href', `https://kitzy.com/${href}`);
            } else if (href.startsWith('./') || href.startsWith('../')) {
                // Convert relative links to point to source repo
                link.setAttribute('href', `https://github.com/kitzy/kitzy/blob/main/${href}`);
            }
        });
        
        console.log('External About content loaded successfully');
        
    } catch (error) {
        console.error('Error loading external About content:', error);
        
        // Fallback: show message about using local content
        aboutContainer.innerHTML = `
            <div class="external-content-error">
                <p><em>Loading content from source repository...</em></p>
                <p>If content doesn't appear, showing local version:</p>
            </div>
        `;
        
        // After a short delay, show the local fallback content
        setTimeout(() => {
            aboutContainer.innerHTML = `
                <h1>Hi, I'm Kitzy 👋</h1>
                
                <p><strong>Customer Support Engineer at <a href="https://github.com/fleetdm">@fleetdm</a> | Infrastructure Nerd | Dog & Motorcycle Lover</strong></p>
                
                <hr>
                
                <h3>👨‍💻 About Me</h3>
                
                <ul>
                    <li>🏳️‍⚧️ Pronouns: they/them/theirs or she/her/hers (either is equally fine)</li>
                    <li>🏆 Over 15 years in endpoint management & IT engineering</li>
                    <li>🛠️ Previously Sr. IT Engineering Manager at Fastly and Professional Services Engineer at Jamf</li>
                    <li>🍏 Got my start at Apple Retail, configuring demo systems and imaging devices</li>
                    <li>🌍 Passionate about infrastructure, automation, and making IT work smarter</li>
                    <li>📖 Curious how I work best? Check out my <a href="/readme/">personal user manual</a></li>
                </ul>
            `;
        }, 3000);
    }
}

// Load external content when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadExternalAboutContent);
} else {
    loadExternalAboutContent();
}