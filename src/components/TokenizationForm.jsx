import { useState } from "react";

const TokenizationForm = ({ amount = 9.99, currency = "USD" }) => {
  const [output, setOutput] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const card = {
      number: form.get("number")?.trim(),
      holder: form.get("holder")?.trim(),
      expiryMonth: form.get("expMonth")?.trim(),
      expiryYear: form.get("expYear")?.trim(),
      cvv: form.get("cvv")?.trim(),
    };

    if (
      !card.number ||
      !card.holder ||
      !card.expiryMonth ||
      !card.expiryYear ||
      !card.cvv
    ) {
      setOutput("Please fill all fields");
      return;
    }

    try {
      const tRes = await fetch(`${API_BASE_URL}/api/payments/axcess/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card }),
      });
      if (!tRes.ok) throw new Error("Tokenization failed");
      const token = await tRes.json();

      const pRes = await fetch(
        `${API_BASE_URL}/api/payments/axcess/token/charge`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            registrationId: token.registrationId,
            amount,
            currency,
          }),
        }
      );
      const payment = await pRes.json();

      setOutput(JSON.stringify({ token, payment }, null, 2));
    } catch (e) {
      setOutput(e.message || "Error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="number" placeholder="Card number" required />
      <input name="holder" placeholder="Name on card" required />
      <input name="expMonth" placeholder="MM" required />
      <input name="expYear" placeholder="YYYY" required />
      <input name="cvv" placeholder="CVV" required />
      <button type="submit">Save Card</button>
      <pre>{output}</pre>
    </form>
  );
};

export default TokenizationForm;
