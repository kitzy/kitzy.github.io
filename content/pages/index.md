---
layout: default
title: About
description: "Customer Support Engineer at Fleet | Infrastructure Nerd | Dog & Motorcycle Lover"
permalink: /
---

<div class="markdown-content">
    <div id="external-about-content">
        <div class="loading-external">Loading content from source repository...</div>
    </div>

    {% if site.posts.size > 0 %}
        <div class="latest-blog-posts" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-color, #e1e4e8);">
            <h2 style="margin-bottom: 1rem;">Recent Blog Posts</h2>
            {% for post in site.posts limit:3 %}
                <article class="blog-post-preview" style="{% if forloop.index > 1 %}margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color, #e1e4e8);{% endif %}">
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
                            <span class="tag-icon">🏷️</span>
                            <span class="post-tags">
                                {% for tag in post.tags %}
                                    <a href="/tag/{{ tag | slugify }}/" class="post-tag">{{ tag }}</a>
                                {% endfor %}
                            </span>
                        </p>
                    {% endif %}
                </article>
            {% endfor %}
            
            <p style="margin-top: 2rem;">
                <a href="/blog/" style="text-decoration: underline;">View all posts →</a>
            </p>
        </div>
    {% endif %}
</div>