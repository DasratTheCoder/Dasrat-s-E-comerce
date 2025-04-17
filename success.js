document.addEventListener('DOMContentLoaded', () => {
    // Clear cart after successful purchase
    localStorage.removeItem('cartItems');
    document.querySelector('.cart-count').textContent = '0';

    // Generate random order number
    const orderNumber = '#' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    document.getElementById('order-number').textContent = orderNumber;

    // Set current date
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('order-date').textContent = now.toLocaleDateString('en-US', options);

    // Get email from localStorage if available
    const email = localStorage.getItem('lastOrderEmail') || 'customer@example.com';
    document.getElementById('order-email').textContent = email;

    // Store email for future reference
    localStorage.setItem('lastOrderEmail', email);
}); 