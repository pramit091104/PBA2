// Function to toggle password visibility
function togglepass(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
}

// Add to Cart functionality
function addToCart(itemName, itemPrice) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

    if (loggedInUser) {
        let cart = JSON.parse(localStorage.getItem(`cart_${loggedInUser.email}`)) || [];
        const item = { name: itemName, price: itemPrice };

        // Add the new item to the cart
        cart.push(item);

        // Save updated cart to localStorage
        localStorage.setItem(`cart_${loggedInUser.email}`, JSON.stringify(cart));

        // Update cart view
        updateCart();
    } else {
        alert('Please log in to add items to the cart.');
    }
}

// Update Cart functionality
function updateCart() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;
    
    if (loggedInUser) {
        const cart = JSON.parse(localStorage.getItem(`cart_${loggedInUser.email}`)) || [];
        const cartList = document.getElementById('cartList');
        cartList.innerHTML = ''; // Clear the current cart

        // Display cart items
        cart.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.price}`;

            // Create a "Remove" button for each item
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.onclick = function() {
                removeFromCart(index); // Call remove function with item index
            };

            li.appendChild(removeButton);
            cartList.appendChild(li);
        });

        // Update cart summary
        updateCartSummary(cart);
    } else {
        alert('Please log in to view your cart.');
    }
}

// Remove Item from Cart functionality
function removeFromCart(index) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser')) || null;

    if (loggedInUser) {
        let cart = JSON.parse(localStorage.getItem(`cart_${loggedInUser.email}`)) || [];
        cart.splice(index, 1); // Remove the item at the specified index
        localStorage.setItem(`cart_${loggedInUser.email}`, JSON.stringify(cart));

        // Update cart view after removal
        updateCart();
    } else {
        alert('Please log in to remove items from your cart.');
    }
}

// Update Cart Summary (Total items and Total Price)
function updateCartSummary(cart) {
    const totalItems = cart.length;
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
}

// Function to handle search
function searchItems() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Get search input
    const products = document.querySelectorAll('.product'); // Get all product elements

    products.forEach(product => {
        const name = product.dataset.name.toLowerCase();
        if (name.includes(searchInput)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    let history = JSON.parse(localStorage.getItem('history')) || [];
    if (searchInput && !history.includes(searchInput)) {
        history.push(searchInput);
        localStorage.setItem('history', JSON.stringify(history)); // Save search history
    }
}

// Register Logic
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        // Save new user in localStorage
        localStorage.setItem('user', JSON.stringify({ name, email, password }));
        alert('Registration successful!');
        window.location.href = 'login.html';
    });
}

// Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const savedUser = JSON.parse(localStorage.getItem('user')) || null;

        if (savedUser && email === savedUser.email && password === savedUser.password) {
            localStorage.setItem('loggedInUser', JSON.stringify(savedUser)); // Store logged-in user
            window.location.href = 'index.html';
        } else {
            document.getElementById('errorMessage').textContent = 'Invalid Username or Password';
        }
    });
}

// On page load, load the cart
window.addEventListener('load', () => {
    updateCart(); // Update the cart and summary when the page loads
});
