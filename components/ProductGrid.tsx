import ProductCard from "./ProductCard";
import { Product } from "../types/Product";
import styles from "../styles/ProductGrid.module.css";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}