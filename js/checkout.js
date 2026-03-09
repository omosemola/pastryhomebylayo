// Get cart items from localStorage
// cartItems is already declared in main.js
// const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
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

    const PROMO_DISCOUNT = 0.20;

    // Base Totals (calculate both original and discounted)
    let originalSubtotal = 0;
    let discountedSubtotal = 0;

    const displayItems = cartItems.map(item => {
        const originalVal = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        const discountedVal = Math.round(originalVal * (1 - PROMO_DISCOUNT));
        originalSubtotal += originalVal;
        discountedSubtotal += discountedVal;

        return {
            ...item,
            originalPriceStr: '₦' + originalVal.toLocaleString(),
            discountedPriceStr: '₦' + discountedVal.toLocaleString(),
            originalValue: originalVal,
            discountedValue: discountedVal
        };
    });

    const tax = 0;
    let shipping = 1000; // Default to option 1
    let total = discountedSubtotal + tax + shipping; // Total based on discounted subtotal

    checkoutContent.innerHTML = `
        <div class="checkout-grid">
            <!-- Customer Information Form -->
            <div class="checkout-section">
                <h2 class="section-title">Customer Information</h2>
                <form id="checkout-form">
                    <div class="form-group">
                        <label class="form-label" for="email">Email Address <span style="color: red;">*</span></label>
                        <input type="email" id="email" class="form-input" placeholder="you@example.com" required>
                    </div>

                    <h3 class="section-title" style="font-size: 1.25rem; margin-top: 2rem;">Shipping Address</h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="firstName">First Name <span style="color: red;">*</span></label>
                            <input type="text" id="firstName" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="lastName">Last Name <span style="color: red;">*</span></label>
                            <input type="text" id="lastName" class="form-input" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="address">Street Address <span style="color: red;">*</span></label>
                        <input type="text" id="address" class="form-input" required>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="city">City <span style="color: red;">*</span></label>
                            <input type="text" id="city" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="phone">Phone Number <span style="color: red;">*</span></label>
                            <input type="tel" id="phone" class="form-input" required>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 2rem; background: var(--color-gray-100); padding: 1.5rem; border-radius: 1rem;">
                        <span style="font-weight: 700; color: var(--color-secondary); display: block; margin-bottom: 1rem;">
                            <i data-lucide="truck" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.5rem;"></i>
                            Delivery Options <span style="color: red;">*</span>
                        </span>
                        
                        <div class="form-group">
                            <select id="delivery-option" class="form-input" style="padding: 1rem; font-family: var(--font-body); font-size: 1rem; cursor: pointer;">
                                <option value="1000">Magboro (₦1,000)</option>
                                <option value="1500">Makogi (₦1,500)</option>
                                <option value="2000">Mowe, Ibafo, Arepo & Opic (₦2,000)</option>
                                <option value="contact">Anywhere inside Lagos (Contact Customer Care)</option>
                            </select>
                        </div>
                        <p id="delivery-contact-note" style="display: none; font-size: 0.85rem; color: #dc2626; margin-top: 0.5rem; font-weight: 600;">
                            Please contact Customer Care (+234 903 470 7684) for delivery information before proceeding if you are outside the standard zones.
                        </p>
                    </div>

                    <button type="submit" class="btn btn-primary checkout-submit-btn" id="main-checkout-btn">
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
                    ${displayItems.map(item => `
                        <div class="order-item">
                            <div class="order-item-img">
                                ${item.image && item.image.includes('<img') ? item.image : `<span style="font-size: 1.5rem;">${item.image || '🧁'}</span>`}
                            </div>
                            <div class="order-item-details">
                                <div class="order-item-title">${item.title}</div>
                                <div class="order-item-price">
                                    <span style="color: var(--color-secondary); font-weight:700;">${item.discountedPriceStr}</span>
                                    <span style="text-decoration:line-through; color:#aaa; font-size:0.85em; margin-left:4px;">${item.originalPriceStr}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="order-summary-totals">
                    <div class="summary-row" style="text-decoration:line-through; color:#aaa; font-size:0.9rem;">
                        <span>Original Subtotal</span>
                        <span>${formatCurrency(originalSubtotal)}</span>
                    </div>
                    <div class="summary-row" style="color:#16a34a; font-size:0.9rem;">
                        <span>Promo Discount (20%)</span>
                        <span>-${formatCurrency(originalSubtotal - discountedSubtotal)}</span>
                    </div>
                    <div class="summary-row" style="margin-top:0.5rem; padding-top:0.5rem; border-top:1px solid #eee;">
                        <span>Subtotal</span>
                        <span>${formatCurrency(discountedSubtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Delivery Fee</span>
                        <span id="summary-delivery">${formatCurrency(shipping)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total To Pay</span>
                        <span class="amount" id="summary-total">${formatCurrency(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize icons
    lucide.createIcons();

    // Handle Delivery Option Change
    const deliverySelect = document.getElementById('delivery-option');
    const mainCheckoutBtn = document.getElementById('main-checkout-btn');
    const summaryDelivery = document.getElementById('summary-delivery');
    const summaryTotal = document.getElementById('summary-total');
    const deliveryNote = document.getElementById('delivery-contact-note');

    let currentShipping = shipping;
    let currentTotal = total;
    let deliveryLabel = "Magboro";

    deliverySelect.addEventListener('change', (e) => {
        const val = e.target.value;
        const selectedText = e.target.options[e.target.selectedIndex].text;

        if (val === 'contact') {
            currentShipping = 0;
            deliveryNote.style.display = 'block';
            summaryDelivery.textContent = "To Be Communicated";
            mainCheckoutBtn.innerHTML = `Proceed to Pay Base Amount - ${formatCurrency(discountedSubtotal)}`;
            deliveryLabel = selectedText;
        } else {
            currentShipping = parseFloat(val);
            deliveryNote.style.display = 'none';
            summaryDelivery.textContent = formatCurrency(currentShipping);
            deliveryLabel = selectedText;
        }

        currentTotal = discountedSubtotal + tax + currentShipping;

        if (val !== 'contact') {
            mainCheckoutBtn.innerHTML = `Proceed to Pay - ${formatCurrency(currentTotal)}`;
        }

        summaryTotal.textContent = formatCurrency(currentTotal);
    });

    // Handle form submission
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showPaymentModal({ total: currentTotal, shipping: currentShipping, label: deliveryLabel, isContact: deliverySelect.value === 'contact' });
    });
}

function showPaymentModal(paymentInfo) {
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
                    <h2>${formatCurrency(paymentInfo.total)}</h2>
                </div>

                <div class="delivery-note">
                    <i data-lucide="truck"></i>
                    <p>
                        <strong>Delivery:</strong> ${paymentInfo.label} 
                        ${paymentInfo.isContact ? '<br><span style="color:#d97706;">(Please contact support to arrange delivery fee separately)</span>' : `(${formatCurrency(paymentInfo.shipping)} included in total)`}
                    </p>
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
            items: validItems.map(item => {
                const originalVal = parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
                const discountedVal = Math.round(originalVal * (1 - PROMO_DISCOUNT));
                return {
                    product: item.id,
                    name: item.title,
                    quantity: 1, // Simplified quantity
                    price: discountedVal // Pass the dynamically computed discounted price to the backend
                };
            }),
            subtotal: paymentInfo.total - paymentInfo.shipping,
            shipping: paymentInfo.shipping, // Recorded
            shippingAddress: { deliveryLabel: paymentInfo.label },
            total: paymentInfo.total
        };

        try {
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const data = await res.json();

            if (res.ok) {
                document.body.removeChild(modalOverlay);
                showSuccessMessage();
            } else {
                console.error('SERVER ERROR DETAILS:', data); // Log full details for debugging
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
