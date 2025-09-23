/**
 * GitHub Token Setup Utility
 * Simple helper to set/remove GitHub personal access token for private repo access
 */

function setupGitHubToken() {
    const currentToken = localStorage.getItem('github_token');
    
    if (currentToken) {
        const action = confirm('GitHub token is already set. Do you want to update it?');
        if (!action) return;
    }
    
    const token = prompt('Enter your GitHub Personal Access Token (it will be stored locally in your browser):');
    
    if (token && token.trim()) {
        localStorage.setItem('github_token', token.trim());
        alert('GitHub token saved! Refresh the page to see private repositories in your language stats.');
    }
}

function removeGitHubToken() {
    const confirmed = confirm('Are you sure you want to remove the GitHub token? This will exclude private repositories from language stats.');
    
    if (confirmed) {
        localStorage.removeItem('github_token');
        alert('GitHub token removed. Refresh the page to update.');
    }
}

function checkGitHubToken() {
    const token = localStorage.getItem('github_token');
    
    if (token) {
        alert('GitHub token is set. Private repositories will be included in language stats.');
    } else {
        alert('No GitHub token set. Only public repositories will be included in language stats.');
    }
}

// Add console helpers
console.log('GitHub Token Setup Helpers:');
console.log('- setupGitHubToken() - Set your GitHub token');
console.log('- removeGitHubToken() - Remove the token');
console.log('- checkGitHubToken() - Check if token is set');