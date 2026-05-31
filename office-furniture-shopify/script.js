const CART_KEY = "officespace-cart";
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
};

const updateCartCount = () => {
  const totalItems = getCart().reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((count) => {
    count.textContent = totalItems;
  });
};

const addToCart = (product) => {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
};

const setupProductSearch = () => {
  const searchInput = document.getElementById("searchInput");
  const cards = [...document.querySelectorAll(".card[data-product-id]")];
  const resultCount = document.getElementById("resultCount");
  const emptyState = document.getElementById("emptyState");

  if (!searchInput || !cards.length) return;

  const filterProducts = () => {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach((card) => {
      const text = `${card.dataset.name} ${card.textContent}`.toLowerCase();
      const isVisible = text.includes(query);
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    resultCount.textContent = `${visibleCount} product${visibleCount === 1 ? "" : "s"}`;
    emptyState.hidden = visibleCount !== 0;
  };

  searchInput.addEventListener("input", filterProducts);
  filterProducts();
};

const setupAddToCartButtons = () => {
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-product-id]");
      const product = {
        id: card.dataset.productId,
        name: card.dataset.name,
        price: Number(card.dataset.price),
      };

      addToCart(product);
      button.textContent = "Added";
      setTimeout(() => {
        button.textContent = "Add to Cart";
      }, 1000);
    });
  });
};

const changeQuantity = (id, amount) => {
  const cart = getCart()
    .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
    .filter((item) => item.quantity > 0);

  saveCart(cart);
  renderCart();
};

const removeItem = (id) => {
  saveCart(getCart().filter((item) => item.id !== id));
  renderCart();
};

const renderCart = () => {
  const cartItems = document.getElementById("cartItems");
  const subtotalElement = document.getElementById("cartSubtotal");
  const totalElement = document.getElementById("cartTotal");

  if (!cartItems || !subtotalElement || !totalElement) return;

  const cart = getCart();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty.</h2>
        <p>Add a chair, desk, or full setup to start building your workspace.</p>
      </div>
    `;
  } else {
    cartItems.innerHTML = cart.map((item) => `
      <article class="cart-item">
        <div>
          <h2>${item.name}</h2>
          <p>${formatter.format(item.price)} each</p>
        </div>
        <div class="item-actions" aria-label="Quantity controls for ${item.name}">
          <button class="icon-btn" type="button" data-decrease="${item.id}" aria-label="Decrease ${item.name}">-</button>
          <strong>${item.quantity}</strong>
          <button class="icon-btn" type="button" data-increase="${item.id}" aria-label="Increase ${item.name}">+</button>
          <button class="icon-btn" type="button" data-remove="${item.id}" aria-label="Remove ${item.name}">x</button>
        </div>
      </article>
    `).join("");
  }

  subtotalElement.textContent = formatter.format(subtotal);
  totalElement.textContent = formatter.format(subtotal);

  cartItems.querySelectorAll("[data-decrease]").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(button.dataset.decrease, -1));
  });

  cartItems.querySelectorAll("[data-increase]").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(button.dataset.increase, 1));
  });

  cartItems.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => removeItem(button.dataset.remove));
  });
};

const setupForms = () => {
  document.querySelectorAll("[data-newsletter], [data-contact-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      form.reset();
      alert("Thank you! We will be in touch soon.");
    });
  });

  const checkoutButton = document.querySelector("[data-checkout]");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (!getCart().length) {
        alert("Your cart is empty. Add a product first.");
        return;
      }

      localStorage.removeItem(CART_KEY);
      updateCartCount();
      renderCart();
      alert("Thank you for your order request!");
    });
  }
};

updateCartCount();
setupProductSearch();
setupAddToCartButtons();
renderCart();
setupForms();
