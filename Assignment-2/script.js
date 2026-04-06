document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allLinks = navLinks.querySelectorAll('a');

    // 1. Toggle Menu when clicking the hamburger
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            // Adds or removes the 'active' class on both elements
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // 2. Auto-Close menu when a link is clicked
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});