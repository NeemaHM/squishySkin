document.addEventListener("DOMContentLoaded", () => {
  // Burger menu toggle
  const bar = document.getElementById("mobile");
  const navbar = document.getElementById("navbar");
  if (bar && navbar) {
    bar.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  }

  // Hero "Shop Now" button
  const shopNowBtn = document.querySelector("#hero button");
  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", () => {
      window.location.href = "products.html";
    });
  }

  // Set year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Country selector modal
  const selectedCountry = localStorage.getItem("selectedCountry");
  if (!selectedCountry) {
    const modalHtml = `
      <div id="country-modal" class="country-modal" aria-modal="true" role="dialog" aria-labelledby="country-modal-title"
        aria-describedby="country-modal-desc" tabindex="-1" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div class="country-modal-content" style="background: white; padding: 30px 25px; border-radius: 12px; max-width: 320px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.2); font-family: sans-serif;">
          <h2 id="country-modal-title" style="color: #2e7d5e;">Where are you shopping from?</h2>
          <p id="country-modal-desc" style="margin-bottom: 20px;">Please select your country to customize your shopping experience.</p>
          <div class="country-options">
            <button type="button" data-country="TZ" style="background:#2e7d5e; color:white; padding:10px 18px; margin:10px; border:none; border-radius:7px; font-weight:bold; cursor:pointer;">TZ - Tanzania</button>
            <button type="button" data-country="US" style="background:#2e7d5e; color:white; padding:10px 18px; margin:10px; border:none; border-radius:7px; font-weight:bold; cursor:pointer;">US - United States</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    document.body.style.overflow = "hidden"; // prevent scroll while modal is open

    document.querySelectorAll("#country-modal button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("data-country");
        localStorage.setItem("selectedCountry", choice);
        document.getElementById("country-modal").remove();
        document.body.style.overflow = "auto"; // restore scroll
        location.reload(); // reload to apply country settings
      });
    });
  }

  // Cart updates
  updateCartCount();
  loadCart();
  updateCheckoutButton();

  // Testimonial slideshow
  let slideIndex = 0;
  const slides = document.querySelectorAll(".testimonial-slide");
  function showSlides() {
    slides.forEach((slide) => slide.classList.remove("active"));
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
    slides[slideIndex - 1].classList.add("active");
    setTimeout(showSlides, 4000);
  }
  if (slides.length > 0) showSlides();
});

// Toast message system
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// Update checkout button enable/disable based on cart
function updateCheckoutButton() {
  const checkoutBtn = document.getElementById("checkout-btn");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (!checkoutBtn) return;

  if (cart.length === 0) {
    checkoutBtn.classList.add("disabled");
    checkoutBtn.removeAttribute("href");
    checkoutBtn.textContent = "Cart is empty";
    checkoutBtn.style.opacity = "0.5";
    checkoutBtn.style.pointerEvents = "none";
  } else {
    checkoutBtn.classList.remove("disabled");
    checkoutBtn.href = "checkout.html";
    checkoutBtn.textContent = "Proceed to Checkout";
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.pointerEvents = "auto";
  }
}

// Update cart count badge
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalItems = cart.reduce(
    (sum, item) => sum + (item.qty || item.quantity || 1),
    0
  );

  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  if (totalItems > 0) {
    cartCount.textContent = totalItems;
    cartCount.style.display = "inline-block";
  } else {
    cartCount.style.display = "none";
  }
}

// Load and display cart table (for cart page)
function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const emptyCartMsg = document.getElementById("empty-cart-msg");

  if (!cartItemsContainer || !subtotalElement) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedCountry = localStorage.getItem("selectedCountry") || "US";

  if (cart.length === 0) {
    if (emptyCartMsg) emptyCartMsg.style.display = "block";
    cartItemsContainer.innerHTML = "";
    subtotalElement.textContent = selectedCountry === "TZ" ? "TZS 0" : "USD 0.00";
    updateCheckoutButton();
    return;
  } else {
    if (emptyCartMsg) emptyCartMsg.style.display = "none";
  }

  cartItemsContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const price = selectedCountry === "TZ" ? Number(item.priceTZSH) : Number(item.priceUSD);
    const quantity = Number(item.qty) || 1;
    const totalPrice = price * quantity;
    subtotal += totalPrice;

    const priceFormatted = selectedCountry === "TZ"
      ? `TZS ${price.toLocaleString()}`
      : `USD ${price.toFixed(2)}`;

    const totalFormatted = selectedCountry === "TZ"
      ? `TZS ${totalPrice.toLocaleString()}`
      : `USD ${totalPrice.toFixed(2)}`;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td data-label="Product">
        <img src="${item.imgSrc || "img/logo.jpg"}" alt="${item.name || "Product"}" />
        <span>${item.name || "Unnamed product"}</span>
      </td>
      <td data-label="Price">${priceFormatted}</td>
      <td data-label="Quantity">
        <input type="number" min="1" value="${quantity}" class="quantity-input" data-index="${index}" />
      </td>
      <td data-label="Total">${totalFormatted}</td>
      <td data-label="Remove">
        <button class="remove-btn" data-index="${index}" aria-label="Remove item">&times;</button>
      </td>
    `;
    cartItemsContainer.appendChild(row);
  });

  subtotalElement.textContent = selectedCountry === "TZ"
    ? `TZS ${subtotal.toLocaleString()}`
    : `USD ${subtotal.toFixed(2)}`;

  addQuantityListeners();
  addRemoveListeners();
  updateCheckoutButton();
}

// Quantity change handler
function addQuantityListeners() {
  const inputs = document.querySelectorAll(".quantity-input");
  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const index = e.target.getAttribute("data-index");
      let newQty = parseInt(e.target.value);

      if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
        e.target.value = 1;
      }

      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart[index]) {
        cart[index].qty = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
        updateCartCount();
        updateCheckoutButton();
      }
    });
  });
}

// Remove item handler
function addRemoveListeners() {
  const buttons = document.querySelectorAll(".remove-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (cart[index]) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
        updateCartCount();
        updateCheckoutButton();
        showToast("Item removed from cart", "info");
      }
    });
  });
}
