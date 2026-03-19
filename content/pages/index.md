---
layout: default
title: About
description: "Customer Support Engineer at Fleet | Infrastructure Nerd | Dog & Motorcycle Lover"
permalink: /
---

<div class="markdown-content">
    <div class="about-content">
        <h1>Hi, I'm Kitzy 👋</h1>

        <p><strong>Customer Support Engineer at <a href="https://fleetdm.com">Fleet</a> | Infrastructure Nerd | Dog &amp; Motorcycle Lover</strong></p>

        <hr>

        <h3>👨‍💻 About Me</h3>

        <ul>
            <li>🏳️‍⚧️ Pronouns: they/them/theirs or she/her/hers (either is equally fine)</li>
            <li>🏆 Over 15 years in endpoint management &amp; IT engineering</li>
            <li>🛠️ Previously Sr. IT Engineering Manager at Fastly and Professional Services Engineer at Jamf</li>
            <li>🍏 Got my start at Apple Retail, configuring demo systems and imaging devices</li>
            <li>🌍 Passionate about infrastructure, automation, and making IT work smarter</li>
            <li>📖 Curious how I work best? Check out my <a href="/readme/">personal user manual</a></li>
        </ul>
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