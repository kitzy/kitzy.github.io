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
        
        // Properly decode base64 content with UTF-8 support
        const binaryString = atob(data.content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const content = new TextDecoder('utf-8').decode(bytes);
        
        console.log('Decoded content:', content.substring(0, 200) + '...');
        
        // Convert markdown to HTML using marked.js (already loaded on page)
        if (typeof marked === 'undefined') {
            throw new Error('marked.js library not loaded');
        }
        
        const htmlContent = marked.parse(content);
        console.log('Converted HTML:', htmlContent.substring(0, 200) + '...');
        
        // Update the container with fetched content
        aboutContainer.innerHTML = htmlContent;
        
        // Add GitHub Sponsors CTA after the main content
        const sponsorCTA = document.createElement('div');
        sponsorCTA.className = 'sponsor-cta';
        sponsorCTA.innerHTML = `
            <hr>
            <h3>💖 Support My Work</h3>
            <p>If you enjoy my content and want to support my blogging and open-source work, consider becoming a sponsor on <a href="https://github.com/sponsors/kitzy" target="_blank">GitHub Sponsors</a>. Your support helps me continue creating and sharing valuable resources!</p>
            <p>
                <a href="https://github.com/sponsors/kitzy" target="_blank">
                    <img src="https://img.shields.io/github/sponsors/kitzy?style=for-the-badge&logo=github&logoColor=white&labelColor=gray&color=pink" alt="GitHub Sponsors" />
                </a>
            </p>
        `;
        aboutContainer.appendChild(sponsorCTA);
        
        // Fix specific link - the README link should point to the /readme/ page
        const readmeLinks = aboutContainer.querySelectorAll('a[href*="README"]');
        readmeLinks.forEach(link => {
            link.setAttribute('href', '/readme/');
        });
        
        // Fix any other relative links to point to the source repo
        const relativeLinks = aboutContainer.querySelectorAll('a[href^="./"], a[href^="../"]');
        relativeLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.setAttribute('href', `https://github.com/kitzy/kitzy/blob/main/${href}`);
        });
        
        console.log('External About content loaded successfully');
        
    } catch (error) {
        console.error('Error loading external About content:', error);
        
        // Show fallback content immediately
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
            
            <hr>
            
            <h3>💖 Support My Work</h3>
            
            <p>If you enjoy my content and want to support my blogging and open-source work, consider becoming a sponsor on <a href="https://github.com/sponsors/kitzy" target="_blank">GitHub Sponsors</a>. Your support helps me continue creating and sharing valuable resources!</p>
            
            <p>
                <a href="https://github.com/sponsors/kitzy" target="_blank">
                    <img src="https://img.shields.io/github/sponsors/kitzy?style=for-the-badge&logo=github&logoColor=white&labelColor=gray&color=pink" alt="GitHub Sponsors" />
                </a>
            </p>
        `;
    }
}

// Load external content when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadExternalAboutContent);
} else {
    loadExternalAboutContent();
}