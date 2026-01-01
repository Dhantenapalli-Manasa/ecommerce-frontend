const API_URL = "http://localhost:3000";

// ---------- LOGIN ----------
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login successful!");
        window.location.href = "profile.html";
      } else {
        alert(data.message);
      }
    });
}

// ---------- REGISTER ----------
function register() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Registration successful!");
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }
    });
}

// ---------- PROFILE ----------
function loadProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  document.getElementById("user-name").innerText = user.name;
  document.getElementById("user-email").innerText = user.email;
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
}

// ---------- PRODUCTS ----------
function loadProducts(category) {
  const container = document.getElementById("products-container");
  if (!container) return;
  container.innerHTML = "";

  let url = `${API_URL}/products`;
  if (category) url += `?category=${category}`;

  fetch(url)
    .then(res => res.json())
    .then(products => {
      products.forEach(p => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-front">
              <img src="${p.name}" alt="${p.name}">
              <h3>${p.name}</h3>
              <p>Category: ${p.category}</p>
              <p>Price: $${p.price}</p>
            </div>
            <div class="card-back">
              <button onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    });
}

// ---------- CART ----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

function addToCart(product) {
  const cart = getCart();
  const exists = cart.find(p => p.id === product.id);
  if (exists) {
    exists.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  saveCart(cart);
}

function increaseQuantity(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (item) { item.quantity += 1; saveCart(cart); }
}

function decreaseQuantity(id) {
  const cart = getCart();
  const item = cart.find(p => p.id === id);
  if (item && item.quantity > 1) {
    item.quantity -= 1;
  } else {
    const index = cart.indexOf(item);
    if(index > -1) cart.splice(index, 1);
  }
  saveCart(cart);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(p => p.id !== id);
  saveCart(cart);
}

function loadCart() {
  const container = document.getElementById("cart-container");
  if (!container) return;
  const cart = getCart();
  container.innerHTML = "";

  let total = 0;

  cart.forEach(p => {
    total += p.price * p.quantity;
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>Price: $${p.price}</p>
      <div class="quantity-container">
        <button onclick='decreaseQuantity(${p.id})'>-</button>
        <span>${p.quantity}</span>
        <button onclick='increaseQuantity(${p.id})'>+</button>
      </div>
      <button onclick='removeFromCart(${p.id})'>Remove</button>
    `;
    container.appendChild(card);
  });

  const totalElement = document.getElementById("cart-total");
  if (totalElement) {
    totalElement.innerHTML = `<strong>Total: $${total}</strong>`;
  }
}