"use client";

import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import CartModal from "./CartModal";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cart = useAppSelector((state) => state.cart.items);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Mi E-Commerce</h2>
          <button
            className={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
            title={`${totalItems} artículos en el carrito`}
          >
            <span className={styles.cartIcon}>🛒</span>
            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </button>
        </div>
      </nav>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}