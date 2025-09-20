---
layout: default
title: Projects
description: "My open source projects and contributions"
permalink: /projects/
---

<div class="markdown-content">
    <h2>Projects</h2>
    
    <div id="projects-container">
        {% for repo in site.github.public_repositories %}
            {% unless repo.name == site.github.repository_name %}
                <div class="project-card">
                    <h3><a href="{{ repo.html_url }}" target="_blank">{{ repo.name }}</a></h3>
                    <p>{{ repo.description }}</p>
                    
                    <div class="project-meta">
                        {% if repo.language %}
                            <span class="language">{{ repo.language }}</span>
                        {% endif %}
                        
                        {% if repo.stargazers_count > 0 %}
                            <span class="stars">⭐ {{ repo.stargazers_count }}</span>
                        {% endif %}
                        
                        {% if repo.forks_count > 0 %}
                            <span class="forks">🍴 {{ repo.forks_count }}</span>
                        {% endif %}
                    </div>
                    
                    {% if repo.topics %}
                        <div class="topics">
                            {% for topic in repo.topics %}
                                <span class="topic">{{ topic }}</span>
                            {% endfor %}
                        </div>
                    {% endif %}
                </div>
            {% endunless %}
        {% endfor %}
    </div>
</div>