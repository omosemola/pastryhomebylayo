// DOM Elements
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');
const heroContent = document.getElementById('hero-content');

const sliderTrack = document.getElementById('slider-track');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');

// Cart Elements
const cartBtns = document.querySelectorAll('.add-btn, .text-link-btn');
const cartCountEl = document.querySelector('.cart-count');
const cartIconBtn = document.querySelector('.cart-btn');

// Data for Gallery
const works = [
    { id: 1, title: 'Wedding Elegance', image: './assets/cakes/cake1.png' },
    { id: 8, title: 'Classic White', image: './assets/cakes/cake8.png' },
    { id: 6, title: 'Royal Tier', image: './assets/cakes/cake6.png' },
    { id: 7, title: 'Golden Touch', image: './assets/cakes/cake7.png' },
    { id: 5, title: 'Pastel Perfection', image: './assets/cakes/cake5.png' },
    { id: 2, title: 'Chocolate Dream', image: './assets/cakes/cake2.png' },
    { id: 3, title: 'Floral Fantasy', image: './assets/cakes/cake3.png' },
    { id: 4, title: 'Birthday Bash', image: './assets/cakes/cake4.png' },
    { id: 9, title: 'Modern Art', image: './assets/cakes/cake9.png' },
];

let currentIndex = 1;

// --- Navbar Logic ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});


// --- Mobile Menu Logic ---
const closeMenuBtn = document.getElementById('close-menu-btn');

function toggleMenu() {
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMenu);
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', toggleMenu);
}

// Close when clicking outside (backdrop)
if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            toggleMenu();
        }
    });
}


if (mobileLinks && mobileLinks.length > 0) {
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}


// --- Cart Logic ---
const cartItemsContainer = document.getElementById('cart-items');
const cartPageContainer = document.getElementById('cart-content');
const cartTotalPriceEl = document.getElementById('cart-total-price');

let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
let cartCount = cartItems.length;

function updateCartUI() {
    if (cartCountEl) {
        cartCountEl.textContent = cartCount;
    }

    // Animate Cart Icon
    if (cartIconBtn) {
        cartIconBtn.classList.remove('bump');
        void cartIconBtn.offsetWidth; // Force reflow
        cartIconBtn.classList.add('bump');
    }

    // Update Cart Sidebar Content
    renderCartItems();
}

// Expose function to refresh cart from localStorage (for other scripts)
window.refreshGlobalCart = () => {
    cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    cartCount = cartItems.length;
    updateCartUI();
}


function renderCartItems_OLD() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    let total = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-msg">
                <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--color-gray-400);"></i>
                <p>Your bag is empty.</p>
                <a href="shop.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Continue Shopping</a>
            </div>
        `;
        if (window.lucide) lucide.createIcons();
    } else {
        // Header with Clear Cart
        const headerEl = document.createElement('div');
        headerEl.className = 'cart-header';
        headerEl.innerHTML = `
            <h2>Your Items (${cartItems.length})</h2>
            <button onclick="clearCart()" class="clear-cart-btn">Remove All Items</button>
        `;
        cartItemsContainer.appendChild(headerEl);

        // Cart Items Grid
        const gridEl = document.createElement('div');
        gridEl.className = 'cart-grid';

        cartItems.forEach((item, index) => {
            const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            total += priceVal;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';

            // Handle image rendering safely
            let imageContent = item.image;
            if (!imageContent || imageContent === '🧁') {
                imageContent = `<div class="cart-placeholder" style="background-color: ${item.color || '#f3f4f6'}">🧁</div>`;
            } else {
                // Ensure image spans container
                imageContent = `<div class="cart-img-wrapper">${item.image}</div>`;
            }

            itemEl.innerHTML = `
                ${imageContent}
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <div class="cart-item-price">${item.price}</div>
                </div>
            `;
            gridEl.appendChild(itemEl);
        });

        cartItemsContainer.appendChild(gridEl);
    }

    if (cartTotalPriceEl) {
        cartTotalPriceEl.textContent = '₦' + total.toLocaleString(); // Use toLocaleString for commas
    }

    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function clearCart() {
    if (confirm('Are you sure you want to remove all items?')) {
        cartItems = []; // Clear array
        renderCartItems(); // Re-render (will confirm empty state)
        cartCount = 0;
        updateCartUI(); // Update UI badge
    }
}

// Make clearCart global
window.clearCart = clearCart;

function removeItem(index) {
    cartItems.splice(index, 1);
    renderCartItems();
    cartCount = cartItems.length;
    updateCartUI();
}
window.removeItem = removeItem;


// Initialize cart UI on page load
renderCartItems();

cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent modal from opening

        // Find product details
        const card = btn.closest('.product-card');
        if (!card) return;

        const title = card.querySelector('.product-title').textContent;
        const price = card.querySelector('.price').textContent;
        const imageContainer = card.querySelector('.product-image-container');
        const colorClass = Array.from(imageContainer.classList).find(c => c.startsWith('bg-')) || 'bg-yellow';

        // Get real image source
        const imgEl = imageContainer.querySelector('img');
        const imageSrc = imgEl ? imgEl.src : null;
        const imageHtml = imageSrc ? `<img src="${imageSrc}" alt="${title}" style="width:100%; height:100%; object-fit:cover;">` : '🧁';

        const colorMap = {
            'bg-yellow': '#fef3c7',
            'bg-red': '#fee2e2',
            'bg-amber': '#fef3c7',
            'bg-green': '#dcfce7'
        };

        // Add to cart array
        cartItems.push({
            title: title,
            price: price,
            color: colorMap[colorClass] || '#f3f4f6',
            image: imageHtml
        });

        cartCount = cartItems.length;
        updateCartUI();

        // Visual Feedback on Button
        const target = e.currentTarget;

        // Store original content (icon)
        const originalContent = target.innerHTML;

        // Change to "Added!"
        target.textContent = "Added!";
        target.classList.add('added-feedback'); // Optional class for styling if needed

        // Revert back to icon after 1 second
        setTimeout(() => {
            target.innerHTML = originalContent;
            target.classList.remove('added-feedback');
            // If using Lucide icons, they might need refreshing if they were raw SVG, 
            // but innerHTML restore usually works for static SVG. 
            // If they are <i data-lucide> tags, we might need lucide.createIcons()
            // But since we restored the generated SVG, it should be fine.
        }, 1000);

        target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            target.style.transform = '';
        }, 150);
    });
});

// --- Reveal On Scroll Logic ---
window.addEventListener('load', () => {
    if (heroContent) {
        // In CSS we handle the initial state opacity-0
        // Here we just trigger the visible class
        heroContent.classList.add('reveal-visible');
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            const element = entry.target;
            const delay = element.dataset.delay || 0;

            if (entry.isIntersecting) {
                // Add delay only on enter
                setTimeout(() => {
                    element.classList.add('reveal-visible');
                }, delay);
            } else {
                // Remove immediately on exit to reset
                element.classList.remove('reveal-visible');
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));
});


// --- Slider Logic (Smooth Transition) ---

// 1. Initialize logic: Create all cards once
function initSlider() {
    if (!sliderTrack) return;
    sliderTrack.innerHTML = '';

    // Track styling for absolute positioning
    sliderTrack.style.position = 'absolute';
    sliderTrack.style.left = '0';
    sliderTrack.style.height = '100%';
    sliderTrack.style.display = 'flex';
    sliderTrack.style.alignItems = 'center';
    sliderTrack.style.gap = '0';
    sliderTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
    sliderTrack.style.willChange = 'transform';

    works.forEach((work, index) => {
        const card = document.createElement('div');
        // Use semantic class
        card.className = 'slider-item';

        card.onclick = () => {
            currentIndex = index;
            updateSlider();
        };

        card.innerHTML = `
            <img src="${work.image}" alt="${work.title}" class="slider-img">
        `;

        sliderTrack.appendChild(card);
    });

    updateSlider();
}

function updateSlider() {
    if (!sliderTrack) return;
    const items = document.querySelectorAll('.slider-item');
    if (items.length === 0) return;

    const containerWidth = sliderTrack.parentElement.offsetWidth;
    const itemWidth = items[0].offsetWidth; // Defined in CSS (240px or 320px)

    // Calculate Center Position
    const centerOffset = (containerWidth / 2) - (itemWidth / 2);
    const translateX = -(currentIndex * itemWidth) + centerOffset;

    sliderTrack.style.transform = `translateX(${translateX}px)`;

    // Update Active States using classes
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Swipe Support
let touchStartX = 0;
let touchEndX = 0;

if (sliderTrack) {
    sliderTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    sliderTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        // Next
        if (currentIndex < works.length - 1) {
            currentIndex++;
            updateSlider();
        } else {
            currentIndex = 0;
            updateSlider();
        }
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        // Prev
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        } else {
            currentIndex = works.length - 1;
            updateSlider();
        }
    }
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentIndex < works.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = works.length - 1;
        }
        updateSlider();
    });
}

// Resize listener to re-center
window.addEventListener('resize', updateSlider);

// Init
initSlider();
updateCartUI();

// --- Product Modal Logic ---
let currentModalProduct = null;

function openProductModal(productCard) {
    const modal = document.getElementById('product-modal');
    if (!modal) return;

    // Safely get content
    const titleEl = productCard.querySelector('.product-title');
    const priceEl = productCard.querySelector('.price');
    const badgeEl = productCard.querySelector('.badge');
    const imageContainer = productCard.querySelector('.product-image-container');

    const title = titleEl ? titleEl.textContent : 'Delicious Pastry';
    const price = priceEl ? priceEl.textContent : '';
    const badge = badgeEl ? badgeEl.textContent : '';

    const colorClass = imageContainer
        ? (Array.from(imageContainer.classList).find(c => c.startsWith('bg-')) || 'bg-yellow')
        : 'bg-yellow';

    // Get product image if it exists
    const productImg = imageContainer ? imageContainer.querySelector('img') : null;
    const productImageSrc = productImg ? productImg.src : null;

    // Update modal content
    const modalTitleEl = document.getElementById('modal-title');
    const modalPriceEl = document.getElementById('modal-price');
    const modalBadgeEl = document.getElementById('modal-badge');
    const modalImage = document.getElementById('modal-image');

    if (modalTitleEl) modalTitleEl.textContent = title;

    // Reset Size to Small and update price
    const smallRadio = document.querySelector('input[name="modal-size"][value="small"]');
    if (smallRadio) {
        smallRadio.checked = true;
    }

    // Special logic for Small Chops Pricing and Cakes
    const specialCakes = ['Vanilla Cake', 'Red Velvet Cake', 'Chocolate Cake'];
    const singleSizeProducts = ['Meat Pie', 'Chin Chin', 'Cheese Steak'];

    // Handle Size Selector Visibility
    const sizeSelector = document.querySelector('.modal-size-selector');
    if (sizeSelector) {
        if (singleSizeProducts.includes(title)) {
            sizeSelector.style.display = 'none';
        } else {
            sizeSelector.style.display = 'flex';
        }
    }

    if (title === 'Small Chops' && modalPriceEl) {
        modalPriceEl.textContent = '₦4,000'; // Default small price
    } else if (specialCakes.includes(title) && modalPriceEl) {
        modalPriceEl.textContent = '₦2,500'; // Default small price for cakes
    } else if (modalPriceEl) {
        modalPriceEl.textContent = price.replace('$', '₦');
    }

    if (modalBadgeEl) {
        modalBadgeEl.textContent = badge;
        modalBadgeEl.style.display = badge ? 'inline-block' : 'none';
    }

    // Update modal image background
    if (modalImage) {
        modalImage.className = `modal-image ${colorClass}`;
        modalImage.style.position = 'relative'; // Ensure positioning for dots

        if (title === 'Small Chops') {
            // Render Slider for Small Chops
            modalImage.innerHTML = `
                <div class="modal-slider" id="modal-slider">
                    <div class="modal-slide">
                        <img src="./assets/products/smallchops_big.png" alt="Small Chops Big">
                    </div>
                    <div class="modal-slide">
                        <img src="./assets/products/smallchops_small.png" alt="Small Chops Small">
                    </div>
                </div>
                <div class="modal-dots">
                    <div class="modal-dot active"></div>
                    <div class="modal-dot"></div>
                </div>
            `;

            // Add scroll listener for dots
            const slider = document.getElementById('modal-slider');
            const dots = document.querySelectorAll('.modal-dot');
            if (slider) {
                slider.addEventListener('scroll', () => {
                    const scrollLeft = slider.scrollLeft;
                    const width = slider.offsetWidth;
                    const index = Math.round(scrollLeft / width);

                    dots.forEach((dot, i) => {
                        dot.classList.toggle('active', i === index);
                    });
                });
            }

        } else {
            // Standard Single Image
            if (productImageSrc) {
                modalImage.innerHTML = `<img src="${productImageSrc}" alt="${title}">`;
            } else {
                modalImage.innerHTML = '<div class="modal-image-placeholder">🧁</div>';
            }
        }
    }

    // Store current product data
    currentModalProduct = {
        id: productCard.dataset.id, // Capture ID from dataset
        title,
        price,
        badge,
        colorClass,
        imageSrc: productImageSrc
    };

    // Show modal with entrance animation
    modal.classList.remove('closing');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Recreate icons
    if (window.lucide) {
        setTimeout(() => lucide.createIcons(), 0);
    }
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');

    // Add closing animation
    modal.classList.add('closing');

    // Wait for animation to complete before hiding
    setTimeout(() => {
        modal.classList.remove('active', 'closing');
        document.body.style.overflow = '';
        currentModalProduct = null;
    }, 500); // Match animation duration
}

function addToCartFromModal() {
    if (!currentModalProduct) return;

    const colorMap = {
        'bg-yellow': '#fef3c7',
        'bg-red': '#fee2e2',
        'bg-amber': '#fef3c7',
        'bg-green': '#dcfce7'
    };

    // Determine Size and Price
    const sizeRadio = document.querySelector('input[name="modal-size"]:checked');
    const size = sizeRadio ? sizeRadio.value : 'small';
    let finalPrice;

    const specialCakes = ['Vanilla Cake', 'Red Velvet Cake', 'Chocolate Cake'];
    const singleSizeProducts = ['Meat Pie', 'Chin Chin', 'Cheese Steak'];

    let titleWithSize;

    // Custom Pricing Logic
    if (currentModalProduct.title === 'Small Chops') {
        finalPrice = size === 'small' ? '₦4,000' : '₦8,000';
        titleWithSize = `${currentModalProduct.title} (${size.charAt(0).toUpperCase() + size.slice(1)})`;
    } else if (specialCakes.includes(currentModalProduct.title)) {
        finalPrice = size === 'small' ? '₦2,500' : '₦7,000';
        titleWithSize = `${currentModalProduct.title} (${size.charAt(0).toUpperCase() + size.slice(1)})`;
    } else if (singleSizeProducts.includes(currentModalProduct.title)) {
        // Single size products use the displayed price directly (cleaned)
        // We assume the openProductModal set the price correctly from the card
        // But price might have currency symbol.
        // Actually, openProductModal sets modalPriceEl. content.
        // But here we can just use the price from the card which was passed in currentModalProduct.price
        // However, checking openProductModal again, it sets modalPriceEl based on title.
        // For single products, it falls through to 'else if (modalPriceEl) ... price.replace'.
        // So currentModalProduct.price holds the price from the card.
        finalPrice = currentModalProduct.price;
        titleWithSize = currentModalProduct.title; // No size suffix
    } else {
        finalPrice = size === 'small' ? '₦2,500' : '₦9,500';
        titleWithSize = `${currentModalProduct.title} (${size.charAt(0).toUpperCase() + size.slice(1)})`;
    }

    // Add to cart
    cartItems.push({
        id: currentModalProduct.id,
        title: titleWithSize,
        price: finalPrice,
        color: colorMap[currentModalProduct.colorClass] || '#f3f4f6',
        image: currentModalProduct.imageSrc ? `<img src="${currentModalProduct.imageSrc}" alt="${currentModalProduct.title}" style="width:100%; height:100%; object-fit:cover;">` : '🧁'
    });

    cartCount = cartItems.length;
    updateCartUI();

    // Close modal
    closeProductModal();
}

// Close modal on backdrop click
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'product-modal') {
                closeProductModal();
            }
        });
    }

    // Add click handlers to product cards (Standard loop as per homepage)
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.cursor = 'pointer';

        card.addEventListener('click', (e) => {
            // Don't open modal if clicking add to cart buttons
            if (e.target.closest('.add-btn') || e.target.closest('.text-link-btn')) {
                return;
            }
            openProductModal(card);
        });
    });
});

// Make functions global for onclick attributes (Close/AddToCart only)
window.closeProductModal = closeProductModal;
window.addToCartFromModal = addToCartFromModal;

window.updateModalPrice = function () {
    const sizeRadio = document.querySelector('input[name="modal-size"]:checked');
    if (!sizeRadio) return;

    // Skip if single size product (shouldn't happen if selector is hidden, but good for safety)
    if (currentModalProduct && ['Meat Pie', 'Chin Chin', 'Cheese Steak'].includes(currentModalProduct.title)) {
        return;
    }

    const priceEl = document.getElementById('modal-price');
    if (priceEl && currentModalProduct) {
        const specialCakes = ['Vanilla Cake', 'Red Velvet Cake', 'Chocolate Cake'];

        if (currentModalProduct.title === 'Small Chops') {
            priceEl.textContent = sizeRadio.value === 'small' ? '₦4,000' : '₦8,000';
        } else if (specialCakes.includes(currentModalProduct.title)) {
            priceEl.textContent = sizeRadio.value === 'small' ? '₦2,500' : '₦7,000';
        } else {
            priceEl.textContent = sizeRadio.value === 'small' ? '₦2,500' : '₦9,500';
        }
    }
};

// Parallax Effect for Shop Banner
document.addEventListener('DOMContentLoaded', () => {
    const shopBanner = document.querySelector('.shop-banner-hero');
    if (shopBanner) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const bannerBg = shopBanner.querySelector('.shop-banner-bg');
            const bannerContent = shopBanner.querySelector('.shop-banner-content');

            if (bannerBg) {
                // Keep scale(1.1) to avoid white edges during scroll
                bannerBg.style.transform = `scale(1.1) translateY(${scrolled * 0.4}px)`;
            }

            if (bannerContent) {
                bannerContent.style.transform = `translateY(${scrolled * 0.15}px)`;
                bannerContent.style.opacity = Math.max(0, 1 - (scrolled * 0.003));
            }
        });
    }
});

// --- New Render Logic (Added to fix cart page rendering) ---
function renderCartItems() {
    // 1. Handle Sidebar/Header Cart
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your bag is empty.</div>';
        } else {
            cartItems.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item-sidebar';
                itemEl.innerHTML = `
                    <div style="font-weight: bold;">${item.title}</div>
                    <div>${item.price}</div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });
        }
    }

    // 2. Handle Main Cart Page
    if (cartPageContainer) {
        cartPageContainer.innerHTML = '';
        let total = 0;

        if (cartItems.length === 0) {
            cartPageContainer.innerHTML = `
                <div class="empty-cart-msg">
                    <i data-lucide="shopping-bag" style="width: 48px; height: 48px; margin-bottom: 1rem; color: var(--color-gray-400);"></i>
                    <p>Your bag is empty.</p>
                    <a href="shop.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block;">Continue Shopping</a>
                </div>
            `;
        } else {
            // Header
            const headerEl = document.createElement('div');
            headerEl.className = 'cart-header';
            headerEl.style.textAlign = 'center';
            headerEl.style.marginBottom = '2rem';
            headerEl.innerHTML = `
                <h2 class="cart-section-title">Your Items (${cartItems.length})</h2>
            `;
            cartPageContainer.appendChild(headerEl);

            // Grid
            const gridEl = document.createElement('div');
            gridEl.className = 'cart-grid';

            cartItems.forEach((item, index) => {
                const priceVal = parseFloat(item.price.replace(/[^0-9.]/g, ''));
                total += priceVal;

                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';

                let imageContent = item.image;
                if (!imageContent || imageContent === '🧁') {
                    imageContent = `<div class="cart-placeholder" style="background-color: ${item.color || '#f3f4f6'}">🧁</div>`;
                } else {
                    imageContent = `<div class="cart-img-wrapper">${item.image}</div>`;
                }

                itemEl.innerHTML = `
                    ${imageContent}
                    <div class="cart-item-details">
                        <h3 class="cart-item-title">${item.title}</h3>
                        <div class="cart-item-price">${item.price}</div>
                    </div>
                     <button onclick="removeItem(${index})" title="Remove Item" class="remove-btn" style="padding: 0.5rem; color: #dc2626; background: none; border: none; cursor: pointer; transition: transform 0.2s;">
                        <i data-lucide="trash-2" style="width: 1.25rem; height: 1.25rem;"></i>
                    </button>
                `;
                gridEl.appendChild(itemEl);
            });
            cartPageContainer.appendChild(gridEl);

            // Actions & Total Section
            const actionsEl = document.createElement('div');
            actionsEl.className = 'cart-actions-container';

            actionsEl.innerHTML = `
                <div class="cart-summary">
                    <div class="cart-total-display">
                        <span class="total-label">Subtotal:</span>
                        <span class="total-amount">₦${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <p style="color: var(--color-gray-500); font-size: 0.6rem; margin-top: -0.5rem; margin-bottom: 0rem;"> Shipping calculated at checkout</p>
                    <a href="checkout.html" class="btn btn-secondary checkout-btn-styled">
                        Proceed to Checkout <i data-lucide="arrow-right" style="width: 1.25rem; height: 1.25rem;"></i>
                    </a>
                </div>
             `;
            cartPageContainer.appendChild(actionsEl);
        }

        if (window.lucide) lucide.createIcons();
    }

    if (cartTotalPriceEl) {
        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace(/[^0-9.]/g, '')), 0);
        cartTotalPriceEl.textContent = '$' + total.toFixed(2);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// --- Events Section Removed by User Request ---
