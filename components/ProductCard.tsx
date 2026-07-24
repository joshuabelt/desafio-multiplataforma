"use client";

import Image from "next/image";
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
      <div className={styles.imageContainer}>
        <Image
          src={product.image}
          alt={product.title}
          width={150}
          height={150}
          className={styles.image}
          priority={false}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.price}>${product.price}</p>
        <button className={styles.button} onClick={() => dispatch(addToCart(product))}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}