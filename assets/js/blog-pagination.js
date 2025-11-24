// Blog pagination - Load More functionality
(function() {
    const postsPerPage = 10;
    let currentlyShowing = postsPerPage;

    function initBlogPagination() {
        const posts = document.querySelectorAll('.blog-post-preview');
        const loadMoreBtn = document.getElementById('load-more-posts');
        const statusText = document.getElementById('posts-status');

        if (!posts.length || posts.length <= postsPerPage) {
            // No pagination needed
            if (statusText) {
                statusText.textContent = posts.length === 1 ? '1 post' : `${posts.length} posts`;
            }
            return;
        }

        // Hide posts beyond the first page
        posts.forEach((post, index) => {
            if (index >= postsPerPage) {
                post.style.display = 'none';
            }
        });

        // Show the Load More button
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'inline-block';
            updateStatus();
        }

        // Add click handler
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                const nextBatch = currentlyShowing + postsPerPage;
                
                posts.forEach((post, index) => {
                    if (index >= currentlyShowing && index < nextBatch) {
                        post.style.display = 'block';
                    }
                });

                currentlyShowing = nextBatch;
                updateStatus();

                // Hide button if all posts are shown
                if (currentlyShowing >= posts.length) {
                    loadMoreBtn.style.display = 'none';
                }

                // Smooth scroll to first newly revealed post
                const firstNewPost = posts[currentlyShowing - postsPerPage];
                if (firstNewPost) {
                    setTimeout(() => {
                        firstNewPost.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        }

        function updateStatus() {
            if (statusText) {
                const showing = Math.min(currentlyShowing, posts.length);
                statusText.textContent = `Showing ${showing} of ${posts.length} posts`;
            }
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlogPagination);
    } else {
        initBlogPagination();
    }
})();
