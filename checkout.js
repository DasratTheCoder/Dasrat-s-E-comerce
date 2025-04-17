document.addEventListener('DOMContentLoaded', () => {
    // Initialize Stripe
    const stripe = Stripe('YOUR_PUBLISHABLE_KEY'); // Replace with your actual Stripe publishable key
    const elements = stripe.elements();

    // Create card element
    const card = elements.create('card', {
        style: {
            base: {
                fontSize: '16px',
                color: '#32325d',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    });

    // Mount the card element
    card.mount('#card-element');

    // Handle real-time validation errors
    card.addEventListener('change', function(event) {
        const displayError = document.getElementById('card-errors');
        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }
    });

    // Handle payment method selection
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment sections
            document.querySelectorAll('.form-section').forEach(section => {
                if (section.classList.contains('credit-card-section') || 
                    section.classList.contains('paypal-section') ||
                    section.classList.contains('apple-pay-section') ||
                    section.classList.contains('google-pay-section')) {
                    section.style.display = 'none';
                }
            });

            // Show selected payment section
            const selectedMethod = this.value;
            document.querySelector(`.${selectedMethod}-section`).style.display = 'block';
        });
    });

    // Handle form submission
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const selectedPaymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        if (selectedPaymentMethod === 'credit-card') {
            // Handle credit card payment
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: card
            });

            if (error) {
                const errorElement = document.getElementById('card-errors');
                errorElement.textContent = error.message;
            } else {
                // Send paymentMethod.id to your server
                handlePayment(paymentMethod.id);
            }
        } else if (selectedPaymentMethod === 'paypal') {
            // Handle PayPal payment
            handlePayPalPayment();
        } else if (selectedPaymentMethod === 'apple-pay') {
            // Handle Apple Pay payment
            handleApplePayPayment();
        } else if (selectedPaymentMethod === 'google-pay') {
            // Handle Google Pay payment
            handleGooglePayPayment();
        }
    });

    // Load cart items from localStorage
    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const orderItemsContainer = document.querySelector('.order-items');
        const subtotalElement = document.querySelector('.subtotal');
        const taxElement = document.querySelector('.tax');
        const totalElement = document.querySelector('.total');
        
        let subtotal = 0;
        
        orderItemsContainer.innerHTML = '';
        
        cartItems.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="order-item-details">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">${item.price}</div>
                </div>
            `;
            orderItemsContainer.appendChild(orderItem);
            
            // Calculate subtotal
            subtotal += parseFloat(item.price.replace('$', ''));
        });
        
        // Calculate totals
        const shipping = 5.99;
        const tax = subtotal * 0.08; // 8% tax rate
        const total = subtotal + shipping + tax;
        
        // Update totals
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Load cart items when page loads
    loadCartItems();

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#2c3e50';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        notification.style.animation = 'slideIn 0.5s ease-out';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    // Update cart count
    function updateCartCount(count) {
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = count;
    }

    // Handle payment processing
    async function handlePayment(paymentMethodId) {
        try {
            const response = await fetch('/process-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethodId,
                    amount: calculateTotalAmount()
                })
            });

            const result = await response.json();

            if (result.success) {
                // Payment successful
                showSuccessMessage();
                clearCart();
            } else {
                // Payment failed
                showErrorMessage(result.error);
            }
        } catch (error) {
            showErrorMessage('An error occurred while processing your payment.');
        }
    }

    // Calculate total amount
    function calculateTotalAmount() {
        const subtotal = parseFloat(document.querySelector('.subtotal').textContent.replace('$', ''));
        const shipping = parseFloat(document.querySelector('.shipping').textContent.replace('$', ''));
        const tax = parseFloat(document.querySelector('.tax').textContent.replace('$', ''));
        return (subtotal + shipping + tax) * 100; // Convert to cents
    }

    // Show success message
    function showSuccessMessage() {
        alert('Payment successful! Thank you for your purchase.');
        window.location.href = '/order-confirmation.html';
    }

    // Show error message
    function showErrorMessage(message) {
        alert(`Payment failed: ${message}`);
    }

    // Clear cart
    function clearCart() {
        localStorage.removeItem('cartItems');
        updateCartCount(0);
    }

    // Initialize cart count
    document.addEventListener('DOMContentLoaded', function() {
        const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        updateCartCount(cart.length);
    });
}); 