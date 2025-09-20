// Jekyll site - minimal JavaScript for enhanced functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Add anchor links to headings
    addHeadingAnchors();
    
    // Enhanced code block styling
    enhanceCodeBlocks();
});

// Add anchor links to headings
function addHeadingAnchors() {
    const headings = document.querySelectorAll('.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6');
    
    headings.forEach(heading => {
        const anchor = heading.textContent
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
        
        heading.id = anchor;
        
        const link = document.createElement('a');
        link.href = `#${anchor}`;
        link.className = 'heading-anchor';
        link.innerHTML = '#';
        link.setAttribute('aria-label', `Link to ${heading.textContent}`);
        
        heading.appendChild(link);
    });
}

// Enhanced code block styling
function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // Add copy button to code blocks
        const pre = block.parentElement;
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(block.textContent);
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(copyButton);
    });
}

// Copy text to clipboard (fallback for older browsers)
function copyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        return true;
    } catch (err) {
        console.error('Fallback: Failed to copy', err);
        return false;
    } finally {
        document.body.removeChild(textArea);
    }
}