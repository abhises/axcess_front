import { useState, useRef } from "react";

const CheckoutWidget = ({
  userId = "u12",
  orderId = "u22",
  amount = 200,
  currency = "USD",
}) => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [redirectUrl, setRedirectUrl] = useState(null);
  const containerRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const startCheckout = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await fetch(`${API_BASE_URL}/payments/axcess/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, orderId, amount, currency }),
      });

      if (!res.ok) throw new Error("Failed to start checkout");
      const { checkoutId, redirectUrl, widgetHtml } = await res.json();

      setRedirectUrl(redirectUrl);

      const container = containerRef.current;
      if (!container) return;

      // If backend already sent HTML
      if (widgetHtml) {
        container.innerHTML = widgetHtml;
        setLoading(false);
        return;
      }

      // Otherwise, build form + script
      container.innerHTML = "";
      const script = document.createElement("script");
      script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(
        checkoutId
      )}`;
      script.async = true;

      const form = document.createElement("form");
      form.className = "paymentWidgets";
      form.setAttribute("data-lang", "en");
      form.setAttribute("data-brands", "VISA MASTER");
      form.action = `${API_BASE_URL}/payments/axcess/callback`;

      container.appendChild(script);
      container.appendChild(form);

      script.addEventListener("load", () => setLoading(false));
      script.addEventListener("error", () => {
        setLoading(false);
        setErr("Could not load payment widget. Use the fallback button.");
      });
    } catch (e) {
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
      <div ref={containerRef}></div>
      {redirectUrl && (
        <button
          type="button"
          onClick={() => window.open(redirectUrl, "_blank", "noopener")}
        >
          Open Payment in a New Tab
        </button>
      )}
    </div>
  );
};

export default CheckoutWidget;
