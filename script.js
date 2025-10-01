// Product database for barcode simulation
const productDatabase = {
    '1326': { name: 'Simba Chips 150g', category: 'SNACKS' },
    '1327': { name: 'Lays Chips 150g', category: 'SNACKS' },
    '1328': { name: 'Coke 500ml', category: 'BEVERAGES' },
    '1329': { name: 'Fanta Orange 500ml', category: 'BEVERAGES' },
    '1330': { name: 'Bread White 700g', category: 'BAKERY' },
    '1331': { name: 'Milk 1L', category: 'DAIRY' },
    '1332': { name: 'Yoghurt 500g', category: 'DAIRY' }
};

let products = JSON.parse(localStorage.getItem('chronoshelf_products')) || [];

// Initialize the app
function initApp() {
    updateDashboard();
    renderProducts();
}

// Add product to inventory
function addProduct() {
    const name = document.getElementById('productName').value;
    const expiry = document.getElementById('expiryDate').value;
    const batch = document.getElementById('batchNumber').value;
    
    if (!name || !expiry || !batch) {
        alert('Please fill all fields');
        return;
    }
    
    const product = {
        id: Date.now(),
        name: name,
        expiry: expiry,
        batch: batch,
        added: new Date().toISOString()
    };
    
    products.unshift(product);
    saveProducts();
    updateDashboard();
    renderProducts();
    
    // Clear form
    document.getElementById('productName').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('batchNumber').value = '';
    
    alert('Product added successfully!');
}

// Simulate barcode scan
function simulateScan(barcode) {
    const product = productDatabase[barcode];
    if (product) {
        document.getElementById('productName').value = product.name;
        alert(`Scanned: ${product.name}\nCategory: ${product.category}`);
    } else {
        alert('Product not found in database');
    }
}

// Calculate product priority
function getPriority(expiryDate) {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 2) return { level: 'critical', color: '#ff4757', label: 'CRITICAL' };
    if (diffDays <= 5) return { level: 'high', color: '#ffa502', label: 'HIGH' };
    if (diffDays <= 10) return { level: 'medium', color: '#ffdd00', label: 'MEDIUM' };
    return { level: 'low', color: '#2ed573', label: 'LOW' };
}

// Update dashboard metrics
function updateDashboard() {
    const urgentItems = products.filter(p => {
        const priority = getPriority(p.expiry);
        return priority.level === 'critical' || priority.level === 'high';
    }).length;
    
    const potentialSavings = urgentItems * 85;
    
    document.getElementById('totalItems').textContent = products.length;
    document.getElementById('urgentItems').textContent = urgentItems;
    document.getElementById('savings').textContent = potentialSavings;
}

// Render product list
function renderProducts() {
    const productList = document.getElementById('productList');
    
    if (products.length === 0) {
        productList.innerHTML = '<div class="empty-state">No products added yet</div>';
        return;
    }
    
    // Sort by priority (critical first)
    const sortedProducts = [...products].sort((a, b) => {
        const priorityA = getPriority(a.expiry);
        const priorityB = getPriority(b.expiry);
        const priorityOrder = { critical: 1, high: 2, medium: 3, low: 4 };
        return priorityOrder[priorityA.level] - priorityOrder[priorityB.level];
    });
    
    productList.innerHTML = sortedProducts.map(product => {
        const priority = getPriority(product.expiry);
        return `
            <div class="product-item ${priority.level}">
                <div class="product-info">
                    <div class="product-name">${product.name}</div>
                    <div class="product-details">
                        Expires: ${product.expiry} | Batch: ${product.batch}
                    </div>
                    ${priority.level === 'critical' ? '<div style="color: #ff4757; font-size: 0.8em; margin-top: 5px;">🚨 SHELVE IMMEDIATELY</div>' : ''}
                </div>
                <div class="priority-badge" style="background: ${priority.color}">
                    ${priority.label}
                </div>
            </div>
        `;
    }).join('');
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('chronoshelf_products', JSON.stringify(products));
}

// Mark product as shelved
function markAsShelved(productId) {
    products = products.filter(p => p.id !== productId);
    saveProducts();
    updateDashboard();
    renderProducts();
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', initApp);