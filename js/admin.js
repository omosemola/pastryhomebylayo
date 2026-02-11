const API_URL = 'http://localhost:5000/api';
console.log('Admin Script Loaded'); // Verify script execution
const token = localStorage.getItem('adminToken');

// Auth Check
if (!token) {
    window.location.href = 'admin.html';
}

// Global State
let currentTab = 'orders';

window.toggleSidebar = () => {
    document.getElementById('sidebar').classList.toggle('active');
    document.querySelector('.sidebar-overlay').classList.toggle('active');
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
    fetchProducts();
});

// Tab Switching logic
window.switchTab = (tab) => {
    currentTab = tab;
    // Update Sidebar UI
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    // Simple lookup based on index or class match, here simplified
    if (tab === 'orders') document.querySelectorAll('.nav-item')[0].classList.add('active');
    if (tab === 'products') document.querySelectorAll('.nav-item')[1].classList.add('active');

    // Update Main Content
    document.querySelectorAll('.dashboard-section').forEach(el => el.classList.remove('active'));
    document.getElementById(`${tab}-section`).classList.add('active');

    // Update Title
    document.getElementById('page-title').textContent = tab.charAt(0).toUpperCase() + tab.slice(1);

    // Mobile: Close sidebar after selection
    if (window.innerWidth <= 768) {
        toggleSidebar();
    }
}

window.logout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = 'admin.html';
}

// ==========================================
// ORDERS LOGIC
// ==========================================
async function fetchOrders() {
    try {
        const res = await fetch(`${API_URL}/orders`, {
            headers: { 'x-auth-token': token }
        });
        const data = await res.json();

        const tbody = document.getElementById('orders-body');
        tbody.innerHTML = '';

        if (data.success) {
            data.data.forEach(order => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-label="Order ID">${order.orderNumber}</td>
                    <td data-label="Customer">${order.customer.name}</td>
                    <td data-label="Items">${order.items.length} items</td>
                    <td data-label="Total">₦${order.total.toLocaleString()}</td>
                    <td data-label="Status"><span class="status-badge status-${order.status}">${order.status}</span></td>
                    <td data-label="Date">${new Date(order.createdAt).toLocaleDateString()}</td>
                    <td data-label="Actions">
                        <button onclick="updateStatus('${order._id}', 'delivered')" class="status-badge status-delivered" style="cursor:pointer; border:none;">Mark Delivered</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Error fetching orders:', err);
    }
}

window.updateStatus = async (id, status) => {
    if (!confirm('Update order status?')) return;
    try {
        await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ status })
        });
        fetchOrders();
    } catch (err) {
        alert('Failed to update status');
    }
}

// ==========================================
// PRODUCTS LOGIC
// ==========================================
async function fetchProducts() {
    try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();

        const tbody = document.getElementById('products-body');
        tbody.innerHTML = '';

        if (data.success) {
            data.data.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-label="Image"><img src="${product.image}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                    <td data-label="Name">${product.name}</td>
                    <td data-label="Price">₦${product.price.toLocaleString()}</td>
                    <td data-label="Category">${product.category}</td>
                    <td data-label="Stock">${product.inStock ? 'In Stock' : 'Out of Stock'}</td>
                    <td data-label="Actions">
                        <button onclick="editProduct('${product._id}')" class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;">Edit</button>
                        <button onclick="deleteProduct('${product._id}')" class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; background: #ef4444; color: white; border: none;">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    } catch (err) {
        console.error('Error fetching products:', err);
    }
}

// Modal Logic
const modal = document.getElementById('product-modal');
const form = document.getElementById('product-form');

window.openProductModal = () => {
    form.reset();
    document.getElementById('product-id').value = '';
    modal.classList.add('active');
}

window.closeProductModal = () => {
    modal.classList.remove('active');
}

window.editProduct = async (id) => {
    try {
        const modal = document.getElementById('product-modal');
        if (!modal) return;

        // Reset and Show Loading State
        document.getElementById('product-id').value = id;
        document.getElementById('p-name').value = 'Loading...';
        document.getElementById('p-price').value = '';


        modal.classList.add('active');

        // Fetch Data
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error('Failed to fetch product');

        const data = await res.json();
        const p = data.data;

        // Populate Form
        document.getElementById('product-id').value = p._id;
        document.getElementById('p-name').value = p.name;
        document.getElementById('p-price').value = p.price;

        document.getElementById('p-category').value = p.category;
        document.getElementById('p-image').value = p.image;
        if (document.getElementById('p-instock')) document.getElementById('p-instock').checked = p.inStock;
        if (document.getElementById('p-featured')) document.getElementById('p-featured').checked = p.featured;

    } catch (err) {
        console.error('Edit Error:', err);
        alert('Failed to load product details.');
        document.getElementById('product-modal').classList.remove('active');
    }
}

// Ensure DOM is fully loaded before binding
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form Submitted'); // Log submission attempt

            const id = document.getElementById('product-id').value;
            if (!token) {
                alert('Authentication Error: No token found. Please login again.');
                return;
            }

            const productData = {
                name: document.getElementById('p-name').value,
                price: Number(document.getElementById('p-price').value),

                category: document.getElementById('p-category').value,
                image: document.getElementById('p-image').value,
                inStock: document.getElementById('p-instock').checked,
                featured: document.getElementById('p-featured').checked
            };

            console.log('Sending Data:', productData); // Log payload

            try {
                const method = id ? 'PUT' : 'POST';
                const url = id ? `${API_URL}/products/${id}` : `${API_URL}/products`;

                console.log(`Request: ${method} ${url}`);

                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                    body: JSON.stringify(productData)
                });

                const data = await res.json();
                console.log('Response:', data);

                if (res.ok) {
                    closeProductModal();
                    fetchProducts();
                    alert('Product saved successfully!');
                } else {
                    console.error('Save failed:', data);
                    const errorMsg = data.message || res.statusText || 'Unknown Error';
                    alert(`Failed to save product: ${errorMsg}`);
                }
            } catch (err) {
                console.error('Network/Code Error:', err);
                alert(`Error saving product: ${err.message}`);
            }
        });
    } else {
        console.error('Product form not found!');
    }
});

window.deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
        await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: { 'x-auth-token': token }
        });
        fetchProducts();
    } catch (err) {
        alert('Failed to delete product');
    }
}
