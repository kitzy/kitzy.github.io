---
layout: default
title: "Analytics Opt-Out"
description: "Opt out of Plausible Analytics tracking on this site."
permalink: /plausible-exclude/
---

<div class="exclude-panel">
    <h1>Analytics Opt-Out</h1>
    <p>This site uses <a href="https://plausible.io" target="_blank" rel="noopener noreferrer">Plausible Analytics</a>, a privacy-friendly analytics tool. If you'd rather not be counted in the visit stats, use the toggle below to exclude your browser from tracking.</p>

    <div class="exclude-status">
        You are currently <strong id="exclude-state">not excluding</strong> your visits from analytics.
    </div>

    <button type="button" id="exclude-toggle" class="exclude-button">Exclude my visits</button>

    <p class="exclude-note">This works by setting a flag in your browser's local storage, so it only applies to this browser on this device.</p>
</div>

<script>
(function () {
    var stateEl = document.getElementById('exclude-state');
    var buttonEl = document.getElementById('exclude-toggle');

    function isExcluded() {
        return window.localStorage.plausible_ignore === 'true';
    }

    function render() {
        if (isExcluded()) {
            stateEl.textContent = 'excluding';
            buttonEl.textContent = 'Stop excluding my visits';
        } else {
            stateEl.textContent = 'not excluding';
            buttonEl.textContent = 'Exclude my visits';
        }
    }

    buttonEl.addEventListener('click', function () {
        if (isExcluded()) {
            window.localStorage.removeItem('plausible_ignore');
        } else {
            window.localStorage.plausible_ignore = 'true';
        }
        render();
    });

    render();
})();
</script>
