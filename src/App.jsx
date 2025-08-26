import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckoutWidget from "./components/CheckoutWidget";
import TokenizationForm from "./components/TokenizationForm";
import ThankYou from "./components/ThankYou";
import AxcessWidget from "./components/AxcessWidget";
// import Test from "./components/Test";
const App = () => {
  return (
    <>
      {/* <Test /> */}
      <CheckoutWidget />
      <AxcessWidget />
      <TokenizationForm />
      <ThankYou />
    </>
  );
};

export default App;
