---
layout: default
title: External Writing
description: "Guides and articles I've written for Fleet"
permalink: /external-writing/
---

<div class="markdown-content">

    {% assign all_writing = site.data.fleet_writing %}

    {% if all_writing and all_writing.size > 0 %}
        <div class="speaking-section">
            <div class="speaking-grid">
                {% for item in all_writing %}
                    <div class="speaking-item">
                        <div class="speaking-header">
                            <h3 class="speaking-title">
                                <a href="{{ item.url }}" target="_blank" rel="noopener noreferrer">
                                    {{ item.title }}
                                </a>
                            </h3>
                            <div class="speaking-meta">
                                <span class="speaking-date">{{ item.published_on | date: "%B %-d, %Y" }}</span>
                                <span class="speaking-venue">{{ item.source }}</span>
                            </div>
                        </div>
                        {% if item.description %}
                            <p class="speaking-description">{{ item.description }}</p>
                        {% endif %}
                    </div>
                {% endfor %}
            </div>
        </div>
    {% else %}
        <div class="speaking-placeholder">
            Unable to load Fleet writing right now. Check back later.
        </div>
    {% endif %}

</div>
