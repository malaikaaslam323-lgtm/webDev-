$(document).ready(function() {
    // --- 1. NAVIGATION LOGIC (Hamburger Menu) ---
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const allLinks = document.querySelectorAll('#navLinks a');

    // Toggle Menu when clicking the hamburger
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Auto-Close menu when a link is clicked
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // --- 2. AJAX FETCH (Featured Deals) ---
    $.ajax({
        url: 'https://fakestoreapi.com/products?limit=4',
        method: 'GET',
        success: function(products) {
            const container = $('#featured-deals-container');
            container.empty(); // Requirement: Clear hardcoded items

            products.forEach(product => {
                const card = `
                    <div class="product-card">
                        <img src="${product.image}" alt="${product.title}">
                        <h4 class="centered-text">${product.title.substring(0, 20)}...</h4>
                        <p class="price centered-text">PKR ${(product.price * 280).toLocaleString()}</p>
                        <div class="card-action" style="flex-direction:column;">
                            <button class="btn-secondary" style="width:100%; margin-bottom:5px;">ADD TO BAG</button>
                            <button class="quick-view-btn" 
                                    data-img="${product.image}"
                                    data-title="${product.title}" 
                                    data-desc="${product.description}" 
                                    data-rating="${product.rating.rate}">
                                QUICK VIEW
                            </button>
                        </div>
                    </div>
                `;
                container.append(card);
            });
        },
        error: function() {
            $('#featured-deals-container').html('<p>Error loading featured deals.</p>');
        }
    });

    // --- 3. INTERACTION (Quick View Modal) ---
    // We use $(document).on because buttons are added dynamically via AJAX
    $(document).on('click', '.quick-view-btn', function() {
        const img = $(this).data('img');
        const title = $(this).data('title');
        const desc = $(this).data('desc');
        const rating = $(this).data('rating');

        $('#modal-body').html(`
            <img src="${img}" class="modal-product-img" alt="${title}" style="width:150px; height:auto; margin-bottom:15px;">
            <h2 style="margin-bottom:10px; font-size:20px;">${title}</h2>
            <p style="font-size:14px; color:#555; line-height:1.5; margin-bottom:15px;">${desc}</p>
            <p><strong>Rating:</strong> ${rating} / 5 ⭐</p>
        `);
        $('#quickview-modal').fadeIn();
    });

    // Close Modal when clicking the 'X'
    $('.close-modal').click(function() {
        $('#quickview-modal').fadeOut();
    });

    // Close Modal when clicking outside the modal box
    $(window).click(function(event) {
        if (event.target.id === 'quickview-modal') {
            $('#quickview-modal').fadeOut();
        }
    });
});