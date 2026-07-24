"use client";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "../redux/features/cart/cartSlice";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <nav className={styles.navbar}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Mi E-Commerce</h2>
        <div className={styles.summary}>
          <p>🛒 {totalItems} artículos</p>
          <p>Total: ${cartTotal}</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <p className={styles.emptyState}>Tu carrito está vacío.</p>
      ) : (
        <div className={styles.cartList}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <span className={styles.itemName}>{item.title} × {item.quantity}</span>
              <div className={styles.quantityGroup}>
                <button className={styles.iconButton} onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
                <button className={styles.iconButton} onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
                <button className={styles.removeButton} onClick={() => dispatch(removeFromCart(item.id))}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}