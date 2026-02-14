// API_URL is now defined in config.js
// const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchShopProducts();
});

async function fetchShopProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const targetUrl = `${API_URL}/products`;

    try {
        const res = await fetch(targetUrl);
        console.log('📡 Response Status:', res.status);

        if (!res.ok) {
            console.error('❌ API Verification Failed:', res.status, res.statusText);
            throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        console.log('📦 Data Received:', data);

        if (data.success && data.data.length > 0) {
            grid.innerHTML = ''; // Clear loading spinner

            data.data.forEach((product, index) => {
                const card = createProductCard(product, index);
                grid.appendChild(card);
            });

            // Re-initialize icons for new elements
            if (window.lucide) lucide.createIcons();

            // Observe for scroll reveal
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('reveal-visible');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));

            // Fallback: Force visibility after a short delay to ensure products appear
            // even if IntersectionObserver fails or behaves unexpectedly.
            setTimeout(() => {
                document.querySelectorAll('.reveal-on-scroll').forEach(el => {
                    el.classList.add('reveal-visible');
                });
            }, 500);

        } else {
            grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No products found.</p>';
        }

    } catch (err) {
        console.error('Shop/API Error:', err);
        grid.innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: red;">Failed to load products. Please check connection.</p>';
    }
}

function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card reveal-on-scroll';
    card.style.transitionDuration = '700ms';
    card.dataset.delay = index * 100; // Stagger effect
    card.dataset.id = product._id; // Store ID for modal logic

    // Determine background color based on category/name (Simple logic for visual variety)
    const bgColors = ['bg-yellow', 'bg-red', 'bg-green', 'bg-amber'];
    const randomBg = bgColors[index % bgColors.length];

    // Format Price
    const formattedPrice = `₦${product.price.toLocaleString()}`;

    // Rating (Mock for now, or real if in DB)
    const ratingHtml = product.rating ? `
        <div class="rating">
            <i data-lucide="star" style="width: 0.75rem; height: 0.75rem; fill: currentColor;"></i>
            <span class="rating-val">${product.rating}</span>
        </div>` : '';

    const badgeHtml = product.badge ? `<span class="badge">${product.badge}</span>` : '';

    card.innerHTML = `
        <div class="product-image-container ${randomBg}">
            <img src="${product.image}" loading="lazy" alt="${product.name}" 
                style="width: 100%; height: 100%; object-fit: cover;"
                onerror="this.src='./assets/logo.png'"> <!-- Fallback image -->
        </div>
        <div class="product-details">
            <div class="product-meta">
                ${badgeHtml}
                ${ratingHtml}
            </div>
            <h3 class="product-title">${product.name}</h3>
            <div class="price-row">
                <span class="price">${formattedPrice}</span>
                <button class="text-link-btn add-to-cart-btn" data-id="${product._id}">
                    <i class="fa-solid fa-cart-arrow-down"></i>
                </button>
            </div>
        </div>
    `;

    // Click Event for Modal
    card.addEventListener('click', (e) => {
        // Prevent opening if clicking specific buttons
        if (e.target.closest('.add-to-cart-btn')) return;

        if (window.openProductModal) {
            window.openProductModal(card);
        }
    });

    // Click Event for Add to Cart
    const addBtn = card.querySelector('.add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop bubbling to card
            handleAddToCart(e, product, randomBg);
        });
    }

    return card;
}

function handleAddToCart(e, product, colorClass) {
    const btn = e.currentTarget;

    // Add to Global Cart (localStorage)
    // Matches logic in main.js
    // Add to Global Cart (localStorage)
    // Matches logic in main.js
    const cartItem = {
        id: product._id, // Critical for backend order
        title: product.name,
        price: `₦${product.price.toLocaleString()}`,
        color: '#f3f4f6', // simplified color mapping
        image: `<img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;">`
    };

    // Get existing cart
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartItems.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Update UI using exposed method from main.js
    if (window.refreshGlobalCart) {
        window.refreshGlobalCart();
    } else {
        // Fallback
        location.reload();
    }

    // Animate Button
    const originalHTML = btn.innerHTML;
    btn.innerHTML = 'Added!';
    btn.classList.add('added-feedback');

    setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.classList.remove('added-feedback');
    }, 1000);
}
