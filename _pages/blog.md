---
layout: default
title: Blog
description: "My thoughts on infrastructure, automation, and IT engineering"
permalink: /blog/
---

<div class="markdown-content">
    <h2>Blog</h2>
    
    {% if site.posts.size > 0 %}
        <div class="blog-posts">
            {% for post in site.posts %}
                <article class="blog-post-preview">
                    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
                    
                    {% if post.date %}
                        <p class="post-meta">
                            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
                        </p>
                    {% endif %}
                    
                    {% if post.description %}
                        <p>{{ post.description }}</p>
                    {% else %}
                        <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
                    {% endif %}
                </article>
            {% endfor %}
        </div>
    {% else %}
        <p>No blog posts found. Create markdown files in the <code>_posts</code> folder to get started!</p>
        <p>Blog posts should be stored as <code>.md</code> files in the <code>_posts</code> directory with the format <code>YYYY-MM-DD-title.md</code>.</p>
    {% endif %}
</div>