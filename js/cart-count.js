document.addEventListener("DOMContentLoaded", () => {
  const cartCountElem = document.getElementById("cart-count");

  if (cartCountElem) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);

    if (totalQty > 0) {
      cartCountElem.textContent = totalQty;
      cartCountElem.style.display = "inline-block";
    } else {
      cartCountElem.style.display = "none";
    }
  }
});
// This script updates the cart count displayed on the page
// It listens for the DOMContentLoaded event to ensure the page is fully loaded before accessing elements