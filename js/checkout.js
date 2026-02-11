// Get cart items from localStorage
const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
const checkoutContent = document.getElementById('checkout-content');

// Formatting utility
const formatCurrency = (amount) => {
    return '₦' + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

function renderCheckout() {
    if (cartItems.length === 0) {
        checkoutContent.innerHTML = `
            <div class="empty-cart-bg">
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
    const subtotal = cartItems.reduce((sum, item) => {
        // Handle price strings like "₦5,000.00" or simple numbers
        const priceString = String(item.price).replace(/[^0-9.]/g, '');
        return sum + (parseFloat(priceString) || 0);
    }, 0);

    // Tax and Shipping (simplified for Bank Transfer context)
    const tax = 0; // Removing tax for simplicity unless requested
    const shipping = 0; // Shipping is handled via instructions
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
                            <label class="form-label" for="phone">Phone Number</label>
                            <input type="tel" id="phone" class="form-input" required>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 2rem; background: var(--color-gray-100); padding: 1.5rem; border-radius: 1rem;">
                        <span style="font-weight: 700; color: var(--color-secondary); display: block; margin-bottom: 0.5rem;">
                            <i data-lucide="info" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.5rem;"></i>
                            Delivery Information
                        </span>
                        <p style="font-size: 0.9rem; color: var(--color-gray-600); line-height: 1.6;">
                            Delivery within Magboro is <strong>₦1,500</strong>. Delivery outside Magboro is between <strong>₦2,500 - ₦5,000</strong> depending on your location. Please add this to your transfer.
                        </p>
                    </div>

                    <button type="submit" class="btn btn-primary checkout-submit-btn">
                        Proceed to Pay - ${formatCurrency(total)}
                    </button>
                    <p style="text-align: center; margin-top: 1rem; font-size: 0.85rem; color: var(--color-gray-500);">
                        A bank transfer modal will open to complete your payment.
                    </p>
                </form>
            </div>

            <!-- Order Summary -->
            <div class="checkout-section sticky-summary">
                <h2 class="section-title">Order Summary</h2>
                
                <div id="order-items">
                    ${cartItems.map(item => `
                        <div class="order-item">
                            <div class="order-item-img">
                                ${item.image && item.image.includes('<img') ? item.image : `<span style="font-size: 1.5rem;">${item.image || '🧁'}</span>`}
                            </div>
                            <div class="order-item-details">
                                <div class="order-item-title">${item.title}</div>
                                <div class="order-item-price">${formatCurrency(parseFloat(String(item.price).replace(/[^0-9.]/g, '') || 0))}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="order-summary-totals">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${formatCurrency(subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery</span>
                        <span>See Instructions</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total (Excl. Delivery)</span>
                        <span class="amount">${formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize icons
    lucide.createIcons();

    // Handle form submission
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showPaymentModal(total);
    });
}

function showPaymentModal(amount) {
    // Create Modal Element
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'payment-modal-overlay';

    modalOverlay.innerHTML = `
        <div class="payment-modal">
            <div class="payment-header">
                <h3>Complete Payment</h3>
                <button class="close-modal-btn"><i data-lucide="x"></i></button>
            </div>
            
            <div class="payment-body">
                <div class="countdown-timer">
                    <span id="timer">02:00</span>
                    <p>Time remaining to make transfer</p>
                </div>

                <div class="bank-details-card">
                    <div class="bank-logo">
                        <span class="opay-text">OPay</span>
                    </div>
                    <div class="account-info">
                        <p class="label">Account Number</p>
                        <div class="number-display">
                            <span>9034707684</span>
                            <button class="copy-btn" onclick="navigator.clipboard.writeText('9034707684')"><i data-lucide="copy"></i></button>
                        </div>
                        <p class="account-name">ELIZABETH OLUWAFUNMILAYO DAIRO</p>
                    </div>
                </div>

                <div class="payment-amount-box">
                    <p>Amount to Transfer</p>
                    <h2>${formatCurrency(amount)} <span>+ Delivery Fee</span></h2>
                </div>

                <div class="delivery-note">
                    <i data-lucide="truck"></i>
                    <p><strong>Reminder:</strong> Add roughly <strong>₦1,500</strong> (Magboro) or <strong>₦2,500-₦5,000</strong> (Outside) for delivery.</p>
                </div>

                <button id="confirm-payment-btn" class="btn btn-primary btn-block">
                    I've Sent the Money
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);
    lucide.createIcons();

    // Close button logic
    modalOverlay.querySelector('.close-modal-btn').addEventListener('click', () => {
        document.body.removeChild(modalOverlay);
    });

    // Countdown Logic
    let timeLeft = 120;
    const timerEl = document.getElementById('timer');
    const timerInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        if (timerEl) timerEl.textContent = display;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (timerEl) {
                timerEl.style.color = 'var(--color-primary)';
                timerEl.textContent = "Time Expired";
            }
        }
    }, 1000);

    // Confirm Payment Logic
    const confirmBtn = document.getElementById('confirm-payment-btn');
    confirmBtn.addEventListener('click', async () => {

        // Disable button to prevent double submit
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Processing...';
        clearInterval(timerInterval);

        // Gather Order Data
        const customer = {
            name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: {
                street: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: 'Lagos', // Defaulting for now
                zipCode: '00000'
            }
        };

        const validItems = cartItems.filter(item => item.id && item.id.length === 24); // Simple ObjectId check

        if (validItems.length === 0) {
            alert('Your cart contains items from an older session. Please clear your cart and shop again.');
            confirmBtn.disabled = false;
            confirmBtn.textContent = "I've Sent the Money";
            return;
        }

        const orderData = {
            customer,
            items: validItems.map(item => ({
                product: item.id,
                name: item.title,
                quantity: 1, // Simplified quantity
                price: parseFloat(String(item.price).replace(/[^0-9.]/g, ''))
            })),
            subtotal: amount,
            shipping: 0, // Handled separately
            total: amount
        };

        try {
            const res = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                document.body.removeChild(modalOverlay);
                showSuccessMessage();
            } else {
                throw new Error(data.message || 'Order failed');
            }

        } catch (err) {
            console.error('Order Error:', err);
            alert(`Error processing order: ${err.message}`);
            confirmBtn.disabled = false;
            confirmBtn.textContent = "I've Sent the Money";
        }
    });
}

async function createOrderInBackend(amount) {
    // This helper will be used when we have IDs.
    // For now, checkout.js is just UI.
    // I will refactor this properly in the next step.
    return true;
}


function showSuccessMessage() {
    checkoutContent.innerHTML = `
        <div class="empty-cart-bg">
            <div class="empty-cart-icon" style="font-size: 5rem; margin-bottom: 1.5rem;">🎉</div>
            <h1 style="font-family: var(--font-serif); font-size: 2.5rem; margin-bottom: 1rem; color: var(--color-secondary);">Order Placed!</h1>
            <p style="font-size: 1.1rem; color: var(--color-gray-500); margin-bottom: 2rem; line-height: 1.6;">
                Thank you! We have received your order.<br>
                <strong>Status:</strong> Payment Verification Pending.<br>
                We will notify you via email once your transfer is confirmed.
            </p>
            <a href="shop.html" class="btn btn-primary" style="display: inline-flex; padding: 1rem 2.5rem; border-radius: 50px;">
                Back to Shop
            </a>
        </div>
    `;
    localStorage.removeItem('cartItems');
    lucide.createIcons();
}

renderCheckout();
