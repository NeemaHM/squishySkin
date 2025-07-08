document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.getElementById("cart-items");
  const emptyMsg = document.getElementById("empty-cart-msg");
  const subtotalElem = document.getElementById("subtotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const country = localStorage.getItem("selectedCountry") || "US";
  const isTZ = country === "TZ";
  const currency = isTZ ? "TZS" : "USD";

  function renderCart() {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = "";
      emptyMsg.style.display = "block";
      subtotalElem.textContent = `${currency} 0`;
      updateCartCount();
      return;
    }

    emptyMsg.style.display = "none";
    cartItemsContainer.innerHTML = "";

    let subtotal = 0;

    cart.forEach((item, index) => {
      const price = isTZ ? item.priceTZSH : item.priceUSD;
      const total = price * item.qty;
      subtotal += total;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.imgSrc}" alt="${item.name}" width="50" /> ${item.name}</td>
        <td>${currency} ${isTZ ? price.toLocaleString() : price.toFixed(2)}</td>
        <td><input type="number" min="1" value="${item.qty}" data-index="${index}" class="quantity-input" /></td>
        <td>${currency} ${isTZ ? total.toLocaleString() : total.toFixed(2)}</td>
        <td><button class="remove-btn" data-index="${index}">&times;</button></td>
      `;
      cartItemsContainer.appendChild(row);
    });

    subtotalElem.textContent = `${currency} ${isTZ ? subtotal.toLocaleString() : subtotal.toFixed(2)}`;

    // Show shipping note only for US users
    const shippingNote = document.getElementById("shipping-note");
    if (!isTZ && shippingNote) {
      shippingNote.style.display = "block";
    } else if (shippingNote) {
      shippingNote.style.display = "none";
    }


    // Attach event listeners AFTER rendering
    attachEventListeners();
  }

  function attachEventListeners() {
    // Update quantity
    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", (e) => {
        const index = e.target.getAttribute("data-index");
        const newQty = parseInt(e.target.value);
        if (newQty > 0) {
          cart[index].qty = newQty;
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart(); // Re-render cart after quantity change
        } else {
          // Reset to previous value if invalid
          e.target.value = cart[index].qty;
        }
      });
    });

    // Remove item
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart(); // Re-render cart after removal
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

  // Initial render
  renderCart();
  updateCartCount();
});