import CatalogContainer from "./components/CatalogContainer";
import { CartProvider } from "./context/CartContext";
// Imagina que tienes un componente Navbar que muestra el total del carrito
import Navbar from "./components/Navbar"; 

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <CatalogContainer />
    </CartProvider>
  );
}
