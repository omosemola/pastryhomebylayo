// Get cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
const checkoutContent = document.getElementById('checkout-content');

function renderCheckout() {
    if (cartItems.length === 0) {
        checkoutContent.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add some delicious pastries to your cart before checking out.</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1.5rem; display: inline-flex;">
                    Continue Shopping
                </a>
            </div>
        `;
        return;
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;

    checkoutContent.innerHTML = `
        <div class="checkout-grid">
            <!-- Customer Information Form -->
            <div class="checkout-section">
                <h2 class="section-title">Customer Information</h2>
                <form id="checkout-form">
                    <div class="form-group">
                        <label class="form-label" for="email">Email Address</label>
                        <input type="email" id="email" class="form-input" placeholder="you@example.com" required>
                    </div>

                    <h3 class="section-title" style="font-size: 1.25rem; margin-top: 2rem;">Shipping Address</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="firstName">First Name</label>
                            <input type="text" id="firstName" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="lastName">Last Name</label>
                            <input type="text" id="lastName" class="form-input" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="address">Street Address</label>
                        <input type="text" id="address" class="form-input" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="city">City</label>
                            <input type="text" id="city" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="zipCode">ZIP Code</label>
                            <input type="text" id="zipCode" class="form-input" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="phone">Phone Number</label>
                        <input type="tel" id="phone" class="form-input" required>
                    </div>

                    <h3 class="section-title" style="font-size: 1.25rem; margin-top: 2rem;">Payment Information</h3>
                    
                    <div class="form-group">
                        <label class="form-label" for="cardNumber">Card Number</label>
                        <input type="text" id="cardNumber" class="form-input" placeholder="1234 5678 9012 3456" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="expiry">Expiry Date</label>
                            <input type="text" id="expiry" class="form-input" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="cvv">CVV</label>
                            <input type="text" id="cvv" class="form-input" placeholder="123" required>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 2rem; padding: 1.25rem;">
                        Place Order - $${total.toFixed(2)}
                    </button>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="checkout-section">
                <h2 class="section-title">Order Summary</h2>
                
                <div id="order-items">
                    ${cartItems.map(item => `
                        <div class="order-item">
                            <div class="order-item-img" style="background-color: ${item.color};">
                                ${item.image}
                            </div>
                            <div class="order-item-details">
                                <div class="order-item-title" style="font-family: 'Spartan', sans-serif;">${item.title}</div>
                                <div class="order-item-price">${item.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="order-summary">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>$${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (8%)</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span>${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span class="amount">$${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Handle form submission
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Show success message
        checkoutContent.innerHTML = `
            <div class="empty-cart" style="padding: 4rem;">
                <div class="empty-cart-icon" style="font-size: 5rem;">✅</div>
                <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1rem;">Order Confirmed!</h1>
                <p style="font-size: 1.25rem; color: var(--color-gray-500); margin-bottom: 2rem;">
                    Thank you for your order! We'll send a confirmation email to your inbox shortly.
                </p>
                <a href="index.html" class="btn btn-primary" style="display: inline-flex; padding: 1rem 2rem;">
                    Continue Shopping
                </a>
            </div>
        `;

        // Clear cart
        localStorage.removeItem('cartItems');

        // Recreate icons
        setTimeout(() => {
            lucide.createIcons();
        }, 0);
    });

    // Recreate icons
    setTimeout(() => {
        lucide.createIcons();
    }, 0);
}

renderCheckout();
