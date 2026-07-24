import CatalogContainer from "../components/CatalogContainer";
import Navbar from "../components/Navbar";
import { CartProvider } from "../cart-components/CartProvider";

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <CatalogContainer />
    </CartProvider>
  );
}
