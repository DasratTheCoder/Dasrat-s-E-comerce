// Product data
const products = [
    // Electronics (20 products)
    {
        id: 1,
        name: "Premium Smartphone",
        price: 699.99,
        category: "electronics",
        rating: 4.5,
        reviews: 128,
        image: "https://via.placeholder.com/300",
        description: "Latest model with advanced features and stunning camera"
    },
    {
        id: 2,
        name: "Ultrabook Laptop",
        price: 1299.99,
        category: "electronics",
        rating: 5,
        reviews: 95,
        image: "https://via.placeholder.com/300",
        description: "Lightweight and powerful laptop for professionals"
    },
    // Add more electronics products...

    // Clothing (20 products)
    {
        id: 21,
        name: "Men's Casual Shirt",
        price: 29.99,
        category: "clothing",
        rating: 4.2,
        reviews: 56,
        image: "https://via.placeholder.com/300",
        description: "Comfortable and stylish casual shirt"
    },
    {
        id: 22,
        name: "Women's Summer Dress",
        price: 49.99,
        category: "clothing",
        rating: 4.7,
        reviews: 89,
        image: "https://via.placeholder.com/300",
        description: "Elegant summer dress for any occasion"
    },
    // Add more clothing products...

    // Home & Kitchen (20 products)
    {
        id: 41,
        name: "Smart Coffee Maker",
        price: 149.99,
        category: "home",
        rating: 4.8,
        reviews: 112,
        image: "https://via.placeholder.com/300",
        description: "Programmable coffee maker with smart features"
    },
    {
        id: 42,
        name: "Air Fryer",
        price: 99.99,
        category: "home",
        rating: 4.6,
        reviews: 78,
        image: "https://via.placeholder.com/300",
        description: "Healthy cooking with less oil"
    },
    // Add more home products...

    // Beauty (20 products)
    {
        id: 61,
        name: "Facial Cleanser",
        price: 24.99,
        category: "beauty",
        rating: 4.3,
        reviews: 45,
        image: "https://via.placeholder.com/300",
        description: "Gentle cleanser for all skin types"
    },
    {
        id: 62,
        name: "Hair Dryer",
        price: 79.99,
        category: "beauty",
        rating: 4.5,
        reviews: 67,
        image: "https://via.placeholder.com/300",
        description: "Professional hair dryer with multiple settings"
    },
    // Add more beauty products...

    // Sports (20 products)
    {
        id: 81,
        name: "Running Shoes",
        price: 89.99,
        category: "sports",
        rating: 4.7,
        reviews: 134,
        image: "https://via.placeholder.com/300",
        description: "Comfortable running shoes with great support"
    },
    {
        id: 82,
        name: "Yoga Mat",
        price: 29.99,
        category: "sports",
        rating: 4.4,
        reviews: 92,
        image: "https://via.placeholder.com/300",
        description: "Non-slip yoga mat for your practice"
    },
    // Add more sports products...

    // Books (20 products)
    {
        id: 101,
        name: "Best Seller Novel",
        price: 14.99,
        category: "books",
        rating: 4.8,
        reviews: 156,
        image: "https://via.placeholder.com/300",
        description: "Latest best-selling novel"
    },
    {
        id: 102,
        name: "Cookbook",
        price: 24.99,
        category: "books",
        rating: 4.6,
        reviews: 78,
        image: "https://via.placeholder.com/300",
        description: "Collection of delicious recipes"
    }
    // Add more books products...
];

// Pagination settings
const productsPerPage = 12;
let currentPage = 1;
let filteredProducts = [...products];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const sortFilter = document.getElementById('sortFilter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumbers = document.getElementById('pageNumbers');

// Event Listeners
searchInput.addEventListener('input', filterProducts);
categoryFilter.addEventListener('change', filterProducts);
priceFilter.addEventListener('change', filterProducts);
sortFilter.addEventListener('change', filterProducts);
prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));

// Filter products based on search, category, and price
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const priceRange = priceFilter.value;
    const sortBy = sortFilter.value;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        const matchesPrice = !priceRange || checkPriceRange(product.price, priceRange);
        return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort products
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
    }

    currentPage = 1;
    renderProducts();
    updatePagination();
}

// Check if price is within range
function checkPriceRange(price, range) {
    switch(range) {
        case '0-50':
            return price <= 50;
        case '50-100':
            return price > 50 && price <= 100;
        case '100-200':
            return price > 100 && price <= 200;
        case '200+':
            return price > 200;
        default:
            return true;
    }
}

// Change page
function changePage(page) {
    if (page < 1 || page > Math.ceil(filteredProducts.length / productsPerPage)) return;
    currentPage = page;
    renderProducts();
    updatePagination();
}

// Update pagination buttons and numbers
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }
    pageNumbers.innerHTML = paginationHTML;
}

// Render products
function renderProducts() {
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    productsContainer.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <p class="description">${product.description}</p>
            <div class="product-rating">
                ${renderStars(product.rating)}
                <span>(${product.reviews})</span>
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join('');
}

// Render star rating
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    return starsHTML;
}

// Add to cart function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = parseInt(cartCount.textContent) + 1;

        // Show success message
        showToast('Product added to cart!', 'success');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Initialize
filterProducts(); 