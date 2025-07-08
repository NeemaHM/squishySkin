document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkout-form");
  const modal = document.getElementById("confirmation-modal");
  const modalText = document.getElementById("instruction-text");
  const closeModal = document.querySelector(".close");
  const submitBtn = document.getElementById("submit-payment-btn");
  const messageDiv = document.getElementById("checkout-message");
  const productField = document.getElementById("product");
  const totalDisplay = document.getElementById("total-display");

  const tzFields = document.getElementById("tz-fields");
  const usFields = document.getElementById("us-fields");
  const paymentTz = document.getElementById("payment-options-tz");
  const paymentUs = document.getElementById("payment-options-us");
  const paymentInstruction = document.getElementById("payment-instruction");
  const paymentInstructionsTz = document.getElementById("payment-instructions-tz");
  const paymentLinksUs = document.getElementById("payment-links-us");

  const userCountry = localStorage.getItem("selectedCountry") || "US";

  // Apply country-specific UI
  if (userCountry === "TZ") {
    tzFields.style.display = "block";
    paymentTz.style.display = "block";
    paymentInstructionsTz.style.display = "block";
    document.getElementById("payment-options-tz").style.display = "block";
    usFields.style.display = "none";
    paymentUs.style.display = "none";
    paymentLinksUs.style.display = "none";
    paymentInstruction.textContent = "Tafadhali lipa kwa Lipa Namba kabla ya kuendelea.";
  } else if (userCountry === "US") {
    usFields.style.display = "block";
    paymentUs.style.display = "block";
    paymentLinksUs.style.display = "flex";
    tzFields.style.display = "none";
    paymentTz.style.display = "none";
    paymentInstructionsTz.style.display = "none";
    paymentInstruction.textContent = "Please choose a payment option below.";
  } else {
    paymentInstruction.textContent = "Please select your country first.";
    tzFields.style.display = "none";
    usFields.style.display = "none";
    paymentTz.style.display = "none";
    paymentUs.style.display = "none";
    paymentInstructionsTz.style.display = "none";
    paymentLinksUs.style.display = "none";
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    showMessage("🛒 Your cart is empty. Please add items before checking out.");
    form.style.display = "none";
    return;
  }

  let orderSummaryLines = [];
  let total = 0;
  const shippingFee = userCountry === "US" ? 15 : 0;

  cart.forEach(item => {
    let price = userCountry === "TZ" ? item.priceTZSH : item.priceUSD;
    let priceFormatted = userCountry === "TZ"
      ? `TZSH ${price.toLocaleString()} /=`
      : `$${price.toFixed(2)}`;

    const qty = item.qty || 1;
    const lineTotal = price * qty;
    total += lineTotal;

    orderSummaryLines.push(`• ${item.name} x ${qty} = ${priceFormatted}`);
  });

  // Add shipping line if US
  if (shippingFee > 0) {
    orderSummaryLines.push(`+ Flat Rate Shipping = $${shippingFee.toFixed(2)}`);
  }

  const totalWithShipping = total + shippingFee;

  const totalFormatted = userCountry === "TZ"
    ? `TZSH ${totalWithShipping.toLocaleString()} /=`
    : `$${totalWithShipping.toFixed(2)}`;

  productField.value = orderSummaryLines.join("\n") + `\n\nTotal: ${totalFormatted}`;

  // Update total display heading
  if (totalDisplay) {
    totalDisplay.textContent = `Total: ${totalFormatted}`;
  }

  closeModal?.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();

    // Validate US address fields if US customer
    if (userCountry === "US") {
      const street1 = document.getElementById("us-street1").value.trim();
      const city = document.getElementById("us-city").value.trim();
      const state = document.getElementById("us-state").value.trim();
      const zip = document.getElementById("us-zip").value.trim();

      if (!street1 || !city || !state || !zip) {
        showMessage("⚠️ Please fill in all required US shipping address fields.");
        return;
      }
    }

    let confirmPaymentChecked = false;
    if (userCountry === "TZ") {
      confirmPaymentChecked = document.getElementById("confirm-payment-tz").checked;
      if (!confirmPaymentChecked) {
        showMessage("⚠️ Please confirm you’ve sent the payment via Lipa Namba.");
        return;
      }
    } else if (userCountry === "US") {
      confirmPaymentChecked = document.getElementById("confirm-payment-us").checked;
      if (!confirmPaymentChecked) {
        showMessage("⚠️ Please confirm you’ve sent the payment via Cash App or PayPal.");
        return;
      }
    } else {
      showMessage("⚠️ Please select your country before checkout.");
      return;
    }

    // Show modal confirmation
    modalText.innerHTML = `
      <strong>Payment Confirmed!</strong><br><br>
      <strong>Total Paid:</strong> ${totalFormatted}<br>
      <strong>Name:</strong> ${name}<br>
      <strong>Email:</strong> ${email}<br><br>
      <strong>Items Ordered:</strong><br>
      <pre style="white-space: pre-wrap;">${orderSummaryLines.join("\n")}</pre>
      <br>📸 <em>Please screenshot this confirmation for your records.</em>
    `;
    modal.style.display = "flex";

    submitBtn.onclick = async () => {
      try {
        const data = {
          name,
          email,
          order: orderSummaryLines.join("\n"),
          total: totalFormatted,
          country: userCountry,
        };

        if (userCountry === "TZ") {
          data.phone = document.getElementById("tz-phone").value.trim();
          data.region = document.getElementById("tz-region").value.trim();
        } else if (userCountry === "US") {
          data.address = [
            document.getElementById("us-street1").value.trim(),
            document.getElementById("us-city").value.trim(),
            document.getElementById("us-state").value.trim(),
            document.getElementById("us-zip").value.trim(),
          ].join(", ");
        }

        await fetch("https://formspree.io/f/xdkzrowv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        localStorage.removeItem("cart");
        window.location.href = "thankyou.html";
      } catch (error) {
        showMessage("❌ Failed to send order. Please try again.");
        console.error("Formspree error:", error);
      }
    };
  });

  function showMessage(msg) {
    messageDiv.textContent = msg;
    messageDiv.classList.remove("hidden");
    messageDiv.classList.add("error");
  }
});
