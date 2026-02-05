// Get cart items from localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
const cartContent = document.getElementById('cart-content');

function removeItem(index) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    renderCart();
}

function renderCart() {
    if (cartItems.length === 0) {
        cartContent.innerHTML = `
            <div class="container" style="max-width: 800px; margin: 0 auto; padding: 3rem 1.5rem;">
                <div style="background: white; border-radius: 1.5rem; padding: 4rem 2rem; text-align: center; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);">
                    <div style="font-size: 5rem; margin-bottom: 1.5rem; opacity: 0.6;">🛒</div>
                    <h1 style="font-family: var(--font-display); font-size: 2.25rem; margin-bottom: 1rem; color: var(--color-secondary);">Your Bag is Empty</h1>
                    <p style="font-size: 1.125rem; color: var(--color-gray-500); margin-bottom: 2rem;">Looks like you haven't added any delicious treats yet.</p>
                    <a href="index.html#shop" class="btn btn-primary" style="display: inline-flex; padding: 1.25rem 2.5rem; font-size: 1.125rem; text-decoration: none;">
                        Explore Our Pastries
                    </a>
                </div>
            </div>
        `;
        setTimeout(() => lucide.createIcons(), 0);
        return;
    }

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')), 0);
    const tax = total * 0.08;
    const shipping = total > 50 ? 0 : 5.99;
    const grandTotal = total + tax + shipping;

    cartContent.innerHTML = `
        <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 1.5rem 3rem;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 3rem;">
                <h1 style="font-family: var(--font-display); font-size: 2.5rem; color: var(--color-secondary); margin-bottom: 0.5rem;">Your Shopping Bag</h1>
                <p style="color: var(--color-gray-500); font-size: 1.125rem;">${cartItems.length} delicious ${cartItems.length === 1 ? 'item' : 'items'} ready for checkout</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
                <!-- Cart Items -->
                <div style="background: white; border-radius: 1.5rem; padding: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06); border: 1px solid var(--color-gray-100);">
                    <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--color-secondary); display: flex; align-items: center; gap: 0.75rem;">
                        <i data-lucide="shopping-bag" style="width: 1.5rem; height: 1.5rem; color: var(--color-primary);"></i>
                        Items in Your Bag
                    </h2>
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        ${cartItems.map((item, index) => `
                            <div style="display: flex; gap: 1.25rem; padding: 1.25rem; background: var(--bg-white); border-radius: 1rem; border: 2px solid var(--color-gray-100); transition: all 0.3s;" 
                                 onmouseover="this.style.borderColor='var(--color-primary)'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'" 
                                 onmouseout="this.style.borderColor='var(--color-gray-100)'; this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                                <div style="width: 90px; height: 90px; border-radius: 0.875rem; background-color: ${item.color}; display: flex; align-items: center; justify-content: center; font-size: 2.25rem; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                    ${item.image}
                                </div>
                                <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
                                    <div style="font-family: 'Spartan', sans-serif; font-size: 1.25rem; font-weight: 700; color: var(--color-secondary); margin-bottom: 0.375rem;">${item.title}</div>
                                    <div style="font-size: 1.125rem; font-weight: 700; color: var(--color-primary); font-family: var(--font-serif);">${item.price}</div>
                                </div>
                                <button onclick="removeItem(${index})" style="padding: 0.625rem; background: rgba(220, 38, 38, 0.1); color: #dc2626; border-radius: 0.5rem; transition: all 0.3s; cursor: pointer; height: fit-content; align-self: center;"
                                        onmouseover="this.style.background='#dc2626'; this.style.color='white'"
                                        onmouseout="this.style.background='rgba(220, 38, 38, 0.1)'; this.style.color='#dc2626'">
                                    <i data-lucide="trash-2" style="width: 1.125rem; height: 1.125rem;"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Order Summary -->
                <div style="background: linear-gradient(135deg, var(--color-primary) 0%, #f8e8ed 100%); border-radius: 1.5rem; padding: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); height: fit-content; position: sticky; top: 7rem;">
                    <h2 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 1.5rem; color: var(--color-secondary); display: flex; align-items: center; gap: 0.75rem;">
                        <i data-lucide="receipt" style="width: 1.5rem; height: 1.5rem;"></i>
                        Order Summary
                    </h2>
                    
                    <div style="background: rgba(255,255,255,0.8); border-radius: 1rem; padding: 1.5rem; backdrop-filter: blur(10px);">
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1rem; border-bottom: 1px solid rgba(0,0,0,0.1);">
                            <span>Subtotal</span>
                            <span style="font-weight: 600;">$${total.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1rem; border-bottom: 1px solid rgba(0,0,0,0.1);">
                            <span>Tax (8%)</span>
                            <span style="font-weight: 600;">$${tax.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; font-size: 1rem; border-bottom: 1px solid rgba(0,0,0,0.1);">
                            <span>Shipping</span>
                            <span style="font-weight: 600;">${shipping === 0 ? 'FREE' : '$' + shipping.toFixed(2)}</span>
                        </div>
                        
                        ${shipping > 0 ? `<div style="background: rgba(212, 175, 55, 0.15); border: 1px solid var(--accent-gold); border-radius: 0.5rem; padding: 0.75rem; margin: 1rem 0; font-size: 0.875rem; color: var(--text-dark); display: flex; align-items: center; gap: 0.5rem;">
                            <i data-lucide="info" style="width: 1rem; height: 1rem; color: var(--accent-gold);"></i>
                            Spend $${(50 - total).toFixed(2)} more for free shipping!
                        </div>` : ''}
                        
                        <div style="display: flex; justify-content: space-between; padding-top: 1.25rem; margin-top: 1rem; border-top: 2px solid var(--color-secondary); font-family: var(--font-serif); font-size: 1.75rem; font-weight: 700;">
                            <span style="color: var(--color-secondary);">Total</span>
                            <span style="color: var(--color-secondary);">$${grandTotal.toFixed(2)}</span>
                        </div>
                    </div>

                    <a href="checkout.html" class="btn btn-primary" style="width: 100%; margin-top: 1.5rem; padding: 1.25rem; text-align: center; display: block; text-decoration: none; font-size: 1.125rem; background: var(--color-secondary); border-color: var(--color-secondary);">
                        Proceed to Checkout
                    </a>

                    <a href="index.html#shop" class="btn btn-outline" style="width: 100%; margin-top: 1rem; padding: 1rem; text-align: center; display: block; text-decoration: none; border-color: var(--color-secondary); color: var(--color-secondary);">
                        Continue Shopping
                    </a>
                </div>
            </div>
        </div>

        <style>
            @media (min-width: 1024px) {
                #cart-content .container > div:last-child {
                    grid-template-columns: 1.5fr 1fr !important;
                }
            }
        </style>
    `;

    // Recreate icons
    setTimeout(() => lucide.createIcons(), 0);
}

// Make removeItem available globally
window.removeItem = removeItem;

// Initial render
renderCart();
