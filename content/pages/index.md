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
        {% assign latest_post = site.posts.first %}
        <div class="latest-blog-post" style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--border-color, #e1e4e8);">
            <h2 style="margin-bottom: 1rem;">Latest Blog Post</h2>
            <article class="blog-post-preview">
                <h3><a href="{{ latest_post.url | relative_url }}">{{ latest_post.title }}</a></h3>
                
                {% if latest_post.date %}
                    <p class="post-meta">
                        <time datetime="{{ latest_post.date | date_to_xmlschema }}">{{ latest_post.date | date: "%B %d, %Y" }}</time>
                        {% assign words = latest_post.content | number_of_words %}
                        {% assign read_time = words | divided_by: 200 | at_least: 1 %}
                        <span class="post-meta-separator">•</span>
                        <span class="post-word-count">{{ words }} words</span>
                        <span class="post-meta-separator">•</span>
                        <span class="post-read-time">{{ read_time }} min read</span>
                    </p>
                {% endif %}
                
                {% if latest_post.description %}
                    <p>{{ latest_post.description }}</p>
                {% else %}
                    <p>{{ latest_post.excerpt | strip_html | truncate: 200 }}</p>
                {% endif %}
                
                {% if latest_post.tags and latest_post.tags.size > 0 %}
                    <p class="post-meta">
                        <span class="tag-icon">🏷️</span>
                        <span class="post-tags">
                            {% for tag in latest_post.tags %}
                                <a href="/tag/{{ tag | slugify }}/" class="post-tag">{{ tag }}</a>
                            {% endfor %}
                        </span>
                    </p>
                {% endif %}
                
                <p style="margin-top: 1rem;">
                    <a href="/blog/" style="text-decoration: underline;">View all posts →</a>
                </p>
            </article>
        </div>
    {% endif %}
</div>