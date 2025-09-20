---
layout: default
title: README.md
description: "Personal user manual and work philosophy"
permalink: /readme/
---

<div class="markdown-content">
{% capture readme_content %}{% include_relative README.md %}{% endcapture %}
{{ readme_content | markdownify }}
</div>