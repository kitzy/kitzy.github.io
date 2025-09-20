/**
 * README Page Dynamic Loading
 * Fetches and renders the root README.md file content
 */

async function loadReadmeContent() {
    const readmeContainer = document.getElementById('readme-container');
    
    if (!readmeContainer) {
        return; // Only run on README page
    }
    
    try {
        console.log('Loading README.md content');
        
        // Fetch the root README.md file
        const response = await fetch('/README.md');
        if (!response.ok) {
            throw new Error(`Failed to fetch README.md: ${response.status}`);
        }
        
        const markdownContent = await response.text();
        console.log('README.md loaded successfully');
        
        // Convert markdown to HTML using marked.js (already loaded in layout)
        const htmlContent = marked.parse(markdownContent);
        
        // Update the container with the rendered content
        readmeContainer.innerHTML = `<div class="markdown-content">${htmlContent}</div>`;
        
        console.log('README.md rendered successfully');
        
    } catch (error) {
        console.error('Error loading README.md:', error);
        
        // Fallback content
        readmeContainer.innerHTML = `
            <div class="readme-error">
                <h2>Unable to load README.md</h2>
                <p>Sorry, there was an error loading the README content. Please visit the <a href="https://github.com/kitzy/kitzy.github.io/blob/main/README.md" target="_blank">GitHub repository</a> to view the README file directly.</p>
            </div>
        `;
    }
}

// Load README when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadReadmeContent);
} else {
    loadReadmeContent();
}