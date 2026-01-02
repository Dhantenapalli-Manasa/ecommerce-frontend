const productsDiv = document.getElementById("products");
const cartDiv = document.getElementById("cart");
const countSpan = document.getElementById("count");

async function loadProducts() {
  const res = await fetch("http://localhost:5000/products");
  const products = await res.json();

  productsDiv.innerHTML = "";
  products.forEach(p => {
    productsDiv.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    `;
  });
}

async function addToCart(id) {
  await fetch("http://localhost:5000/cart", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ id })
  });
  loadCart();
}

async function loadCart() {
  const res = await fetch("http://localhost:5000/cart");
  const cart = await res.json();

  cartDiv.innerHTML = "";
  cart.forEach((item, index) => {
    cartDiv.innerHTML += `
      <div class="cart-item">
        ${item.name} - ₹${item.price}
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
  });

  countSpan.innerText = cart.length;
}

async function removeItem(index) {
  await fetch(`http://localhost:5000/cart/${index}`, {
    method: "DELETE"
  });
  loadCart();
}

loadProducts();
loadCart();