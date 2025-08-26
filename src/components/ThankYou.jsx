import { useEffect, useState } from "react";

const ThankYou = () => {
  const [message, setMessage] = useState("Loading…");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");
    if (status === "success") {
      setMessage("Payment successful — access granted.");
    } else if (status === "failed") {
      setMessage("Payment failed — please try a different card.");
    } else {
      setMessage("Thanks — processing your payment…");
    }
  }, []);

  return <h1>{message}</h1>;
};

export default ThankYou;
