document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const subtotalElem = document.getElementById("subtotal");
  const cartSummary = document.getElementById("cart-summary");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const country = localStorage.getItem("selectedCountry") || "US";
  const isTZ = country === "TZ";
  const currency = isTZ ? "TZSH" : "USD";

  function renderCart() {
    if (cart.length === 0) {
      if (cartItemsContainer) cartItemsContainer.innerHTML = "";
      if (emptyMsg) emptyMsg.style.display = "block";
      if (subtotalElem) subtotalElem.textContent = `${currency} 0`;
      updateCartCount();
      const shippingNote = document.getElementById("shipping-note");
      if (shippingNote) shippingNote.style.display = "none";
      return;
    }

    if (emptyMsg) emptyMsg.style.display = "none";
    if (cartItemsContainer) cartItemsContainer.innerHTML = "";

    let subtotal = 0;
    let itemCount = 0;

    cart.forEach((item, index) => {
      const price = isTZ ? item.priceTZSH : item.priceUSD;
      const qty = item.qty;
      const total = price * qty;
      subtotal += total;
      itemCount += qty;

      if (cartItemsContainer) {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="${item.imgSrc}" alt="${item.name}" width="50" /> ${item.name}</td>
          <td>${currency} ${isTZ ? price.toLocaleString() : price.toFixed(2)}</td>
          <td><input type="number" min="1" value="${qty}" data-index="${index}" class="quantity-input" /></td>
          <td>${currency} ${isTZ ? total.toLocaleString() : total.toFixed(2)}</td>
          <td><button class="remove-btn" data-index="${index}">&times;</button></td>
        `;
        cartItemsContainer.appendChild(row);
      }
    });

    if (subtotalElem) subtotalElem.textContent = `${currency} ${isTZ ? subtotal.toLocaleString() : subtotal.toFixed(2)}`;

    // Show estimated shipping fee for US only
    const shippingNote = document.getElementById("shipping-note");
    if (!isTZ && shippingNote) {
      shippingNote.style.display = "block";
      const shippingEstimate = itemCount <= 4 ? 8 : 12;
      shippingNote.innerHTML = `
        <em>Note: Estimated U.S. shipping is <strong>$${shippingEstimate.toFixed(2)}</strong> for ${itemCount} item${itemCount === 1 ? '' : 's'}. Final total shown at checkout.</em>
      `;
    }

    attachEventListeners();
    updateCartCount();
  }

  function attachEventListeners() {
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.getAttribute("data-index");
        const newQty = parseInt(e.target.value);
        if (newQty > 0) {
          cart[index].qty = newQty;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        } else {
          e.target.value = cart[index].qty;
        }
      });
    });

    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
      });
    });
  }

  function updateCartCount() {
    const countElem = document.getElementById("cart-count");
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (countElem) {
      countElem.textContent = totalQty;
      countElem.style.display = totalQty > 0 ? "inline-block" : "none";
    }
  }

  renderCart();
});
