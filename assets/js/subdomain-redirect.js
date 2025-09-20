/**
 * Subdomain Redirect Handler
 * Redirects any subdomain.kitzy.com to kitzy.com
 */

(function() {
    // Check if we're on a subdomain
    const hostname = window.location.hostname;
    const targetDomain = 'kitzy.com';
    
    // Only redirect if we're on a subdomain (not the main domain)
    if (hostname !== targetDomain && hostname.endsWith('.kitzy.com')) {
        console.log('Subdomain detected:', hostname, '- redirecting to:', targetDomain);
        
        // Preserve the path and query parameters
        const newUrl = 'https://' + targetDomain + window.location.pathname + window.location.search + window.location.hash;
        
        // Redirect to main domain
        window.location.replace(newUrl);
    }
})();