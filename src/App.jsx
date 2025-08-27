import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckoutWidget from "./components/CheckoutWidget";
import TokenizationForm from "./components/TokenizationForm";
import ThankYou from "./components/ThankYou";
import AxcessWidget from "./components/AxcessWidget";
import AxcessCallback from "./components/AxcessCallback";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home page or main widgets */}
        <Route
          path="/"
          element={
            <>
              <CheckoutWidget />
              <AxcessWidget />
              <TokenizationForm />
              <ThankYou />
            </>
          }
        />

        {/* Axcess callback route */}
        <Route path="/payments/axcess/callback" element={<AxcessCallback />} />
      </Routes>
    </Router>
  );
};

export default App;
