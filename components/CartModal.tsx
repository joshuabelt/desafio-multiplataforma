"use client";

import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  clearCart,
} from "../redux/features/cart/cartSlice";
import styles from "../styles/CartModal.module.css";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Modal */}
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🛒 Mi Carrito</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {cart.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tu carrito está vacío</p>
              <p className={styles.emptySubtext}>
                Agrega productos para comenzar
              </p>
            </div>
          ) : (
            <>
              <div className={styles.cartList}>
                {cart.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <p className={styles.itemPrice}>
                        ${item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className={styles.quantityGroup}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => dispatch(increaseQuantity(item.id))}
                      >
                        +
                      </button>
                    </div>

                    <p className={styles.subtotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      className={styles.removeButton}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Artículos:</span>
                  <span>{totalItems}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Total:</span>
                  <span className={styles.totalPrice}>
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.clearButton}
                  onClick={() => dispatch(clearCart())}
                >
                  Vaciar carrito
                </button>
                <button className={styles.checkoutButton}>
                  Proceder al pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
