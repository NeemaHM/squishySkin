document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  // Product list with both USD and TZSH prices
  const products = [
    {
      id: "1",
      name: "Non-greasy UV sunscreen",
      priceUSD: 13,
      priceTZSH: 35000,
      image: "img/bestseller/uv.jpg",
      category: "Sun screen",
      description: "A daily lightweight sunscreen with a matte finish and built-in moisturizer.",
      ingredients: "Modern broad-spectrum UV filters + moisturizing base",
      purpose: "Protects against sun damage (aging, dark spots). Essential when using actives like vitamin C or niacinamide.",
      forWho: "Everyone — all skin types, every single day."
    },
    {
      id: "2",
      name: "NiaTX10/4 Serum",
      priceUSD: 17,
      priceTZSH: 45000,
      image: "img/products/niatx10 2 serum.jpg",
      category: "Serum",
      description: "High-performance niacinamide + tranexamic acid serum for brightening and clearing skin.",
      ingredients: "Niacinamide, Tranexamic Acid, Vitamin E, plus skin-strengthening molecules.",
      purpose: "Fights dark spots & melasma, controls oil, and strengthens skin barrier.",
      forWho: "All skin types, including sensitive. For beginners, start once a day and build up to twice."
    },
    {
      id: "3",
      name: "Soothing bar soap",
      priceUSD: 9.99,
      priceTZSH: 15000,
      image: "img/products/barsoap.jpg",
      category: "Cleanser",
      description: "A detoxifying sea salt and goat milk soap that exfoliates gently.",
      ingredients: "Sea Salt, Goat Milk",
      purpose: "Gently exfoliates dead skin, balances oil, and helps with breakouts and rough patches.",
      forWho: "Best for oily, acne-prone, or dull skin. If very dry, follow with a good moisturizer."
    },
    {
      id: "4",
      name: "Hyaluronic plus",
      priceUSD: 17,
      priceTZSH: 45000,
      image: "img/products/hyluronic plus+ serum.jpg",
      category: "Serum",
      description: "Ultra-hydrating serum to plump, smooth, and soften skin.",
      ingredients: "Hyaluronic Acid, PDRN (plus other secret skin-boosting agents)",
      purpose: "Deep hydration, improves elasticity, and softens texture.",
      forWho: "All skin types — especially dry, dehydrated, or tired skin. Even oily skin needs hydration."
    },
    {
      id: "5",
      name: "L-Ascorbic plus serum",
      priceUSD: 13,
      priceTZSH: 35000,
      image: "img/products/lacorbic serum.jpg",
      category: "Vitamin C Serum",
      description: "Vitamin C serum powered with modern ingredients for bright, even-toned skin.",
      ingredients: "Stabilized L-Ascorbic Acid, PDRN",
      purpose: "Brightens, fades dark spots, and provides antioxidant protection.",
      forWho: "All skin types — especially dull, uneven, or aging skin."
    },
    // Add more products as needed
    {
      id: "6",
      name: "Blue Copper Peptide Serum GHK-Cu",
      priceUSD: 15.99,
      priceTZSH: 28000,
      image: "img/products/bluePeptide2.jpg",
      category: "Serum",
      description: "Infused with advanced peptides, hydrating agents, and skin-repairing actives, this lightweight serum stimulates collagen, repairs skin damage, and restores elasticity, leaving your skin smoother, plumper, and glowing.",
      ingredients: "GHK-Cu (Blue Copper Peptide / 블루 구리 펩타이드) ",
      purpose: "Boosts collagen and elastin to smooth wrinkles, accelerates skin healing and strengthens the barrier, and restores firmness for a youthful look.",
      forWho: "Targets fine lines, sagging skin, dullness, and post-treatment damage (e.g.: microneedling, peels) while boosting collagen for a firmer, healthier-looking complexion."
    },
    {
      id: "7",
      name: "ANTI ACNE Moisturizer",
      priceUSD: 25,
      priceTZSH: 62000, // conversion rate USD to TSH
      image: "img/products/antiacne.jpg",
      category: "Moisturizer",
      description: "Lightweight, fast-absorbing formula powered by Salicylic Acid, Azelaic Acid & Niacinamide to target breakouts, refine pores, and fade dark spots.",
      ingredients: "Salicylic Acid, Azelaic Acid, Niacinamide, Centella Asiatica, Aloe Vera, Hyaluronic Acid",
      purpose: "Hydrates, soothes, clears breakouts, minimizes pores, and brightens dark spots for balanced, smooth, and clear skin.",
      forWho: "Best for acne-prone, oily, or combination skin. Gentle enough for sensitive types seeking hydration and clarity."
    }
  ];

  const product = products.find(p => p.id === productId);
  const container = document.getElementById("product-details");

  if (!product) {
    container.innerHTML = "<p>Product not found.</p>";
    return;
  }

  // Read user country selection from localStorage (or fallback)
  const country = localStorage.getItem("selectedCountry") || "US";

  // Show price based on country
  let priceHTML = "";
  if (country === "TZ") {
    priceHTML = `<h2>TZSH ${product.priceTZSH.toLocaleString()} /=</h2>`;
  } else {
    priceHTML = `<h2>USD ${product.priceUSD.toFixed(2)}</h2>`;
  }

  container.innerHTML = `
    <div class="single-pro-image">
      <img src="${product.image}" alt="${product.name}" width="100%" />
    </div>
    <div class="single-pro-details">
      <h6>Home / ${product.category}</h6>
      <h4>${product.name}</h4>
      ${priceHTML}
      <label for="quantity">Quantity</label>
      <input type="number" id="quantity" value="1" min="1" />
      <button class="normal" onclick="addToCartFromDetails('${product.id}')">Add To Cart</button>

      <h4>Product Description</h4>
      <p>${product.description}</p>

      <h4>Ingredients</h4>
      <p>${product.ingredients}</p>

      <h4>Purpose</h4>
      <p>${product.purpose}</p>

      <h4>Who's it for?</h4>
      <p>${product.forWho}</p>
    </div>
  `;
});

// Updated addToCart function to include price per country
function addToCartFromDetails(productId) {
  const quantity = parseInt(document.getElementById('quantity').value);

  const products = [
    { id: "1", name: "Non-greasy UV sunscreen", priceUSD: 13, priceTZSH: 35000, imgSrc: "img/bestseller/uv.jpg" },
    { id: "2", name: "NiaTX10/4 Serum", priceUSD: 17, priceTZSH: 45000, imgSrc: "img/products/niatx10 2 serum.jpg" },
    { id: "3", name: "Soothing bar soap", priceUSD: 9.99, priceTZSH: 15000, imgSrc: "img/products/barsoap.jpg" },
    { id: "4", name: "Hyaluronic plus", priceUSD: 17, priceTZSH: 45000, imgSrc: "img/products/hyluronic plus+ serum.jpg" },
    { id: "5", name: "L-Ascorbic plus serum", priceUSD: 13, priceTZSH: 35000, imgSrc: "img/products/lacorbic serum.jpg" },
    { id: "6", name: "Blue Copper Peptide Serum GHK-Cu", priceUSD: 15.99, priceTZSH: 28000, imgSrc: "img/products/bluePeptide2.jpg" },
    { id: "7", name: "ANTI ACNE Moisturizer", priceUSD: 25, priceTZSH: 62000, imgSrc: "img/products/antiacne.jpg" }
    // Add more products as needed
  ];

  const product = products.find(p => p.id === String(productId));
  if (!product) return;

  const country = localStorage.getItem("selectedCountry") || "US";

  // Determine price to add based on country
  const price = country === "TZ" ? product.priceTZSH : product.priceUSD;

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingIndex = cart.findIndex(item => item.id === product.id);

  if (existingIndex > -1) {
    cart[existingIndex].qty += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      priceUSD: product.priceUSD,
      priceTZSH: product.priceTZSH,
      qty: quantity,
      imgSrc: product.imgSrc
    });

  }

  localStorage.setItem('cart', JSON.stringify(cart));

  // Update cart count badge if present
  const cartCountElem = document.getElementById("cart-count");
  if (cartCountElem) {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountElem.textContent = totalQty;
    cartCountElem.style.display = "inline-block";
  }

  // Show temporary confirmation on button
  const btn = document.querySelector('.single-pro-details button');
  btn.textContent = `✓ Added to cart`;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = "Add To Cart";
    btn.disabled = false;
  }, 1800);
}