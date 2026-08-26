---
layout: default
title: Blog
description: "My thoughts on infrastructure, automation, and IT engineering"
permalink: /
hide_updated_on: true
---

<div class="markdown-content">
    {% if site.posts.size > 0 %}
        <div class="blog-posts">
            {% for post in site.posts %}
                <article class="blog-post-preview" data-post-index="{{ forloop.index0 }}">
                    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
                    
                    {% if post.date %}
                        <p class="post-meta">
                            <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %d, %Y" }}</time>
                            {% assign words = post.content | number_of_words %}
                            {% assign read_time = words | divided_by: 200 | at_least: 1 %}
                            <span class="post-meta-separator">•</span>
                            <span class="post-word-count">{{ words }} words</span>
                            <span class="post-meta-separator">•</span>
                            <span class="post-read-time">{{ read_time }} min read</span>
                        </p>
                    {% endif %}
                    
                    {% if post.description %}
                        <p>{{ post.description }}</p>
                    {% else %}
                        <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
                    {% endif %}
                    
                    {% if post.tags and post.tags.size > 0 %}
                        <p class="post-meta">
                            <span style="display: inline-flex; align-items: flex-start;">
                                <span class="tag-icon">🏷️</span><span class="post-tags">
                                    {% for tag in post.tags %}
                                        <a href="/tag/{{ tag | slugify }}/" class="post-tag">{{ tag }}</a>
                                    {% endfor %}
                                </span>
                            </span>
                        </p>
                    {% endif %}
                </article>
            {% endfor %}
        </div>
        <div class="blog-load-more-container" style="text-align: center; margin: 2rem 0;">
            <button id="load-more-posts" class="load-more-button" style="display: none; padding: 0.75rem 2rem; font-size: 1rem; background: var(--link-color, #0066cc); color: white; border: none; border-radius: 4px; cursor: pointer;">
                Load More Posts
            </button>
            <p id="posts-status" style="color: var(--text-secondary, #666); font-size: 0.9rem;"></p>
        </div>
    {% else %}
        <p>No blog posts found. Create markdown files in the <code>content/_posts</code> folder to get started!</p>
        <p>Blog posts should be stored as <code>.md</code> files in the <code>content/_posts</code> directory with the format <code>YYYY-MM-DD-title.md</code>.</p>
    {% endif %}
</div>