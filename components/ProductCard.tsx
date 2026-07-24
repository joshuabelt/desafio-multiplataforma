"use client";

import type { Product } from "../types/Product";
import { useAppDispatch } from "../redux/hooks";
import { addToCart } from "../redux/features/cart/cartSlice";
import styles from "../styles/ProductCard.module.css";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{product.title}</h3>
      <p className={styles.price}>${product.price}</p>

      <button className={styles.button} onClick={() => dispatch(addToCart(product))}>
        Agregar al carrito
      </button>
    </div>
  );
}