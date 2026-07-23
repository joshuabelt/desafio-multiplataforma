import { Product } from "../data/products";
import { useCart } from "../cart-components/CartContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Extraemos SOLO la función que necesitamos del contexto
  const { addToCart } = useCart();

  return (
    <div style={{ border: "1px solid #ccc", padding: "16px", borderRadius: "8px" }}>
      <div style={{ fontSize: "48px", textAlign: "center" }}>{product.image}</div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {/* Ejecutamos la función global al hacer clic */}
      <button onClick={() => addToCart(product)} style={{ marginTop: "10px" }}>
        Agregar al carrito
      </button>
    </div>
  );
}