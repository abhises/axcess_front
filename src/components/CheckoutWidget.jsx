import { useState, useRef } from "react";

const CheckoutWidget = ({
  userId = "unn12333",
  orderId = "u22ddd",
  amount = 4000,
  currency = "USD",
}) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const containerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const startCheckout = async () => {
    try {
      setLoading(true);
      setErr("");

      // call backend to create checkout
      const res = await fetch(`${API_BASE_URL}/payments/axcess/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, orderId, amount, currency }),
      });

      if (!res.ok) throw new Error("Failed to start checkout");

      const { checkoutId } = await res.json();

      const container = containerRef.current;
      if (!container) return;

      // clear old iframe
      container.innerHTML = "";

      // build full HTML with script + form
      const widgetHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Checkout</title>
          </head>
          <body>
            <script src="https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${checkoutId}" async></script>
            <form action="${BASE_URL}/payments/axcess/callback"
                  class="paymentWidgets"
                  data-lang="en"
                  data-brands="VISA MASTER">
            </form>
          </body>
        </html>
      `;

      // create iframe
      const iframe = document.createElement("iframe");
      iframe.width = "100%";
      iframe.height = "650";
      iframe.style.border = "none";
      container.appendChild(iframe);

      // inject widgetHtml into iframe
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(widgetHtml);
      doc.close();

      setLoading(false);
    } catch (e) {
      console.error("Checkout error:", e);
      setLoading(false);
      setErr(e.message || "Something went wrong");
    }
  };

  return (
    <div>
      <button onClick={startCheckout} disabled={loading}>
        Buy Now (${amount})
      </button>

      {loading && <div>Loading…</div>}
      {err && <p style={{ color: "red" }}>{err}</p>}

      <div ref={containerRef} style={{ marginTop: "20px" }} />
    </div>
  );
};

export default CheckoutWidget;
