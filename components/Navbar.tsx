"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import CartModal from "./CartModal";
import styles from "../styles/Navbar.module.css";
import { loginUser, logoutUser, registerUser } from "../redux/features/auth/authSlice";

export default function Navbar() {
  const dispatch = useAppDispatch();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const cart = useAppSelector((state) => state.cart.items);
  const auth = useAppSelector((state) => state.auth);

  const totalItems = cart.reduce<number>((sum: number, item: { quantity: number }) => sum + item.quantity, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "shopping-auth",
        JSON.stringify({ user: auth.user, isAuthenticated: auth.isAuthenticated })
      );
    }
  }, [auth.user, auth.isAuthenticated]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) return;

    const user = {
      id: crypto.randomUUID(),
      name: isRegistering ? name : "Cliente",
      email,
      password,
    };

    if (isRegistering) {
      dispatch(registerUser(user));
    } else {
      dispatch(loginUser(user));
    }

    setIsAuthOpen(false);
    setName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>Mi E-Commerce</h2>
          <div className={styles.actions}>
            <button className={styles.authButton} onClick={() => setIsAuthOpen(true)}>
              {auth.isAuthenticated ? `Hola, ${auth.user?.name || "cliente"}` : "Iniciar sesión"}
            </button>
            <button
              className={styles.cartButton}
              onClick={() => setIsCartOpen(true)}
              title={`${totalItems} artículos en el carrito`}
            >
              <span className={styles.cartIcon}>🛒</span>
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </button>
          </div>
        </div>
      </nav>

      {isAuthOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsAuthOpen(false)}>
          <div className={styles.authModal} onClick={(event) => event.stopPropagation()}>
            <div className={styles.authHeader}>
              <h3>{isRegistering ? "Crear cuenta" : "Iniciar sesión"}</h3>
              <button className={styles.closeButton} onClick={() => setIsAuthOpen(false)}>
                ✕
              </button>
            </div>

            <form className={styles.authForm} onSubmit={handleSubmit}>
              {isRegistering && (
                <input
                  className={styles.input}
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              )}
              <input
                className={styles.input}
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className={styles.input}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button className={styles.submitButton} type="submit">
                {isRegistering ? "Registrarme" : "Entrar"}
              </button>
            </form>

            <button
              className={styles.switchButton}
              onClick={() => setIsRegistering((prev) => !prev)}
            >
              {isRegistering ? "Ya tengo cuenta" : "Crear una cuenta"}
            </button>

            {auth.isAuthenticated && (
              <button className={styles.logoutButton} onClick={() => dispatch(logoutUser())}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>
      )}

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
