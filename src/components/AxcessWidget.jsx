import { useEffect, useRef, useState } from "react";

const AxcessWidget = ({ orderId, amount, currency = "USD", locale = "en" }) => {
  const containerRef = useRef(null);
  const [redirectUrl, setRedirectUrl] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/payments/axcess/checkout`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, amount, currency }),
          }
        );
        if (!res.ok) throw new Error("Failed to start checkout");
        const { checkoutId, redirectUrl, widgetHtml } = await res.json();
        if (cancelled) return;
        setRedirectUrl(redirectUrl);

        const el = containerRef.current;
        if (!el) return;

        if (widgetHtml) {
          el.innerHTML = widgetHtml;
          setLoading(false);
          return;
        }

        el.innerHTML = "";
        const script = document.createElement("script");
        script.src = `https://eu-test.oppwa.com/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(
          checkoutId
        )}`;
        script.async = true;

        const form = document.createElement("form");
        form.className = "paymentWidgets";
        form.setAttribute("data-lang", locale);
        form.setAttribute("data-brands", "VISA MASTER");
        form.action = "/payments/axcess/callback";

        el.appendChild(script);
        el.appendChild(form);

        script.addEventListener("load", () => setLoading(false));
        script.addEventListener("error", () => {
          setLoading(false);
          setErr("Could not load payment widget. Use fallback button.");
        });
      } catch (e) {
        if (!cancelled) {
          setLoading(false);
          setErr(e.message || "Checkout failed");
        }
      }
    })();

    return () => {
      cancelled = true;
      const el = containerRef.current;
      if (el) el.innerHTML = "";
    };
  }, [orderId, amount, currency, locale]);

  return (
    <div>
      {loading && <div>Loading…</div>}
      {err && <div style={{ color: "red" }}>{err}</div>}
      <div ref={containerRef} />
      {redirectUrl && (
        <button
          type="button"
          onClick={() => window.open(redirectUrl, "_blank", "noopener")}
        >
          Open Payment in New Tab
        </button>
      )}
    </div>
  );
};

export default AxcessWidget;
