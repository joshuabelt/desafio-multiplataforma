import { useCart } from "../cart-components/CartContext";

export default function Navbar() {
  // Extraemos los datos que queremos mostrar
  const { cart, cartTotal } = useCart();
  
  // Calculamos la cantidad total de artículos
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "20px", background: "#f8f9fa" }}>
      <h2>Mi E-Commerce</h2>
      <div>
        <span>🛒 {totalItems} artículos</span>
        <span style={{ marginLeft: "15px", fontWeight: "bold" }}>Total: ${cartTotal}</span>
      </div>
    </nav>
  );
}