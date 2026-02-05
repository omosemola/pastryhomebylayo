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
    { id: 2, title: 'Chocolate Dream', image: './assets/cakes/cake2.png' },
    { id: 3, title: 'Floral Fantasy', image: './assets/cakes/cake3.png' },
    { id: 4, title: 'Birthday Bash', image: './assets/cakes/cake4.png' },
    { id: 5, title: 'Pastel Perfection', image: './assets/cakes/cake5.png' },
    { id: 6, title: 'Royal Tier', image: './assets/cakes/cake6.png' },
    { id: 7, title: 'Golden Touch', image: './assets/cakes/cake7.png' },
    { id: 8, title: 'Classic White', image: './assets/cakes/cake8.png' },
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
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

mobileMenuBtn.addEventListener('click', toggleMenu);

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', toggleMenu);
}

// Close when clicking outside (backdrop)
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        toggleMenu();
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// --- Cart Logic ---
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPriceEl = document.getElementById('cart-total-price');

let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
let cartCount = cartItems.length;

function updateCartUI() {
    cartCountEl.textContent = cartCount;

    // Animate Cart Icon
    cartIconBtn.classList.remove('bump');
    void cartIconBtn.offsetWidth; // Force reflow
    cartIconBtn.classList.add('bump');

    // Update Cart Sidebar Content
    renderCartItems();
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your bag is empty.</div>';
    } else {
        cartItems.forEach(item => {
            total += parseFloat(item.price.replace('$', ''));

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-img" style="background-color: ${item.color};">
                    ${item.image}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    cartTotalPriceEl.textContent = '$' + total.toFixed(2);

    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Initialize cart UI on page load
renderCartItems();

cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Find product details
        const card = btn.closest('.product-card');
        if (!card) return;

        const title = card.querySelector('.product-title').textContent;
        const price = card.querySelector('.price').textContent;
        const imageContainer = card.querySelector('.product-image-container');
        const colorClass = Array.from(imageContainer.classList).find(c => c.startsWith('bg-'));

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
            image: '🧁'
        });

        cartCount = cartItems.length;
        updateCartUI();

        // Visual Feedback on Button
        const target = e.currentTarget;
        if (target.classList.contains('text-link-btn')) {
            const originalText = target.textContent;
            target.textContent = "Added!";
            setTimeout(() => { target.textContent = originalText; }, 1000);
        }

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

// --- Product Modal Logic ---
let currentModalProduct = null;

function openProductModal(productCard) {
    const modal = document.getElementById('product-modal');
    const title = productCard.querySelector('.product-title').textContent;
    const price = productCard.querySelector('.price').textContent;
    const badge = productCard.querySelector('.badge').textContent;
    const imageContainer = productCard.querySelector('.product-image-container');
    const colorClass = Array.from(imageContainer.classList).find(c => c.startsWith('bg-'));

    // Get product image if it exists
    const productImg = imageContainer.querySelector('img');
    const productImageSrc = productImg ? productImg.src : null;

    // Update modal content
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-price').textContent = price;
    document.getElementById('modal-badge').textContent = badge;

    // Update modal image
    const modalImage = document.getElementById('modal-image');
    modalImage.className = `modal-image ${colorClass}`;

    // Add product image to modal if it exists
    if (productImageSrc) {
        modalImage.innerHTML = `<img src="${productImageSrc}" alt="${title}">`;
    } else {
        modalImage.innerHTML = '<div class="modal-image-placeholder">🧁</div>';
    }

    // Store current product data
    currentModalProduct = {
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
    setTimeout(() => lucide.createIcons(), 0);
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

    // Add to cart
    cartItems.push({
        title: currentModalProduct.title,
        price: currentModalProduct.price,
        color: colorMap[currentModalProduct.colorClass] || '#f3f4f6',
        image: '🧁'
    });

    cartCount = cartItems.length;
    updateCartUI();

    // Close modal
    closeProductModal();
}

// Close modal on backdrop click
document.getElementById('product-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
        closeProductModal();
    }
});

// Add click handlers to product cards
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

// Make functions global for onclick attributes
window.closeProductModal = closeProductModal;
window.addToCartFromModal = addToCartFromModal;
