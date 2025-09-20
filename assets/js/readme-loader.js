/**
 * README.md Dynamic Content Loader
 * Fetches and displays the root README.md content on the /readme/ page
 */

async function loadReadmeContent() {
    const readmeContainer = document.getElementById('readme-container');
    
    if (!readmeContainer) {
        return; // Only run on readme page
    }
    
    try {
        console.log('Loading README.md content...');
        
        // Try fetching from relative path first, then fallback to GitHub raw
        let response;
        try {
            response = await fetch('/README.md');
            if (!response.ok) throw new Error('Local fetch failed');
        } catch (localError) {
            console.log('Local fetch failed, trying GitHub raw URL...');
            response = await fetch('https://raw.githubusercontent.com/kitzy/kitzy.github.io/main/README.md');
        }
        
        if (!response.ok) {
            throw new Error(`Failed to fetch README.md: ${response.status}`);
        }
        
        const markdownContent = await response.text();
        console.log('README.md content loaded successfully');
        
        // Convert markdown to HTML using marked.js (already included in the layout)
        if (typeof marked !== 'undefined') {
            const htmlContent = marked.parse(markdownContent);
            readmeContainer.innerHTML = htmlContent;
        } else {
            // Fallback: display as preformatted text if marked.js isn't available
            readmeContainer.innerHTML = `<pre>${markdownContent}</pre>`;
        }
        
        console.log('README.md content rendered');
        
    } catch (error) {
        console.error('Error loading README.md content:', error);
        
        // Fallback content
        readmeContainer.innerHTML = `
            <div class="readme-error">
                <p>Unable to load README.md content at the moment.</p>
                <p>Please visit the <a href="https://github.com/kitzy/kitzy.github.io/blob/main/README.md" target="_blank">README.md on GitHub</a> to view the content.</p>
            </div>
        `;
    }
}

// Load README content when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReadmeContent);
} else {
    loadReadmeContent();
}