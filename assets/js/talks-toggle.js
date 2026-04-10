// Archived talks toggle
(function() {
    var btn = document.getElementById('toggle-archived-talks');
    var section = document.getElementById('archived-talks-section');
    if (!btn || !section) return;

    btn.addEventListener('click', function() {
        var isHidden = section.style.display === 'none';
        section.style.display = isHidden ? 'block' : 'none';
        btn.textContent = isHidden ? 'Hide archived talks' : 'Show archived talks';
    });
})();
